import { NextRequest, NextResponse } from "next/server";
import {
	ActionError,
	ActionGetResponse,
	ActionPostRequest,
	ActionPostResponse,
	createPostResponse,
	MEMO_PROGRAM_ID,
} from "@solana/actions";
import {
	Connection,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	TransactionInstruction,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js";

import { CLUSTER_URL, HEADERS, URL_PATH, getUsernameWallet } from "@/helpers";

const CURRENCY = "SOL";
const DEFAULT_NOTE = "Thank you for all you do and more!";

export async function GET(
	req: NextRequest,
	context: { params: { username: string } }
) {
	let username = context.params.username;
	if (!username?.trim()) username = "BuyMeBlinks";
	const payload: ActionGetResponse = {
		title: "Buy Me Blinks",
		icon: `${new URL(req.url).origin}/buymeblinkslogo.jpg`,
		description: `Show appreciation to @${username}.\n\n**ensure your wallet is on devnet mode and you have some SOL for gas fee`,
		label: "Send SOL",
		links: {
			actions: [
				{
					href: `${URL_PATH}/appreciate/${username}?amount={amount}&note={note}`,
					label: `SEND ${CURRENCY}`,
					parameters: [
						{
							name: "amount",
							label: `Enter ${CURRENCY} amount`,
							required: true,
						},
						{ name: "note", label: `Add a note` },
					],
				},
			],
		},
	};

	return NextResponse.json(payload, { status: 200, headers: HEADERS });
}

export async function POST(
	req: NextRequest,
	context: { params: { username: string } }
) {
	try {
		let username = context.params.username;
		if (!username?.trim()) username = "BuyMeBlinks";

		const params = new URL(req.url).searchParams;
		let note = params.get("note");
		if (!note?.toString().trim()) note = DEFAULT_NOTE;
		const amount = params.get("amount");
		if (!amount?.toString().trim()) {
			throw new Error("`amount` parameter is required");
		}
		const amountNum = parseFloat(amount as string);
		if (Number.isNaN(amountNum)) {
			throw new Error("Invalid `amount` parameter");
		}

		const body: ActionPostRequest = await req.json();
		if (!body.account?.trim()) {
			throw new Error("`account` field is required");
		}

		let payer: PublicKey;
		try {
			payer = new PublicKey(body.account);
		} catch (err: any) {
			throw new Error("Invalid account provided: not a valid public key");
		}

		const connection = new Connection(CLUSTER_URL);
		const { blockhash } = await connection.getLatestBlockhash();

		// Airdrop some sol for gas fee
		// await connection.requestAirdrop(payer, LAMPORTS_PER_SOL);
		const to_pubkey = new PublicKey(getUsernameWallet(username));

		const initializeSOLtransfer = SystemProgram.transfer({
			fromPubkey: payer,
			toPubkey: to_pubkey,
			lamports: amountNum * LAMPORTS_PER_SOL,
		});

		const initializeNoteMemo = new TransactionInstruction({
			programId: new PublicKey(MEMO_PROGRAM_ID),
			data: Buffer.from(note, "utf-8"),
			keys: [],
		});

		const message = new TransactionMessage({
			payerKey: payer,
			recentBlockhash: blockhash,
			instructions: [initializeSOLtransfer, initializeNoteMemo],
		}).compileToV0Message();

		const tx = new VersionedTransaction(message);

		const payload: ActionPostResponse = await createPostResponse({
			fields: {
				transaction: tx,
				links: {
					next: {
						type: "post",
						href: `${URL_PATH}/appreciate/${username}/confirm`,
					},
				},
			},
		});

		return NextResponse.json(payload, { status: 200, headers: HEADERS });
	} catch (err: any) {
		return NextResponse.json({ message: err.message } as ActionError, {
			status: 400,
			headers: HEADERS,
		});
	}
}

export const OPTIONS = GET;
