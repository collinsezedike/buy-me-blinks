import { NextRequest, NextResponse } from "next/server";
import {
	ActionError,
	ActionGetResponse,
	ActionPostRequest,
	ActionPostResponse,
	createPostResponse,
} from "@solana/actions";
import {
	Connection,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js";

import { CLUSTER_URL, HEADERS, URL_PATH } from "@/helpers";

const TO_PUBKEY = new PublicKey(process.env.PROGRAM_ACCOUNT!);

export async function GET(req: NextRequest) {
	const payload: ActionGetResponse = {
		title: "Buy Me Blinks",
		icon: `${new URL(req.url).origin}/buymeblinkslogo.jpg`,
		description: `Mint a unique username for receiving appreciation via BuyMeBlinks.\n\n**ensure your wallet is on devnet mode and you have some SOL for gas fee`,
		label: "Mint Blink",
		links: {
			actions: [
				{
					href: `${URL_PATH}/mint?username={username}`,
					label: "Mint Blink",
					parameters: [
						{
							name: "username",
							label: "Enter a unique username",
							required: true,
						},
					],
				},
			],
		},
	};

	return NextResponse.json(payload, { status: 200, headers: HEADERS });
}

export async function POST(req: NextRequest) {
	try {
		const username = new URL(req.url).searchParams.get("username");
		if (!username) throw new Error("No username was provided");

		const body: ActionPostRequest = await req.json();
		if (!body.account?.trim())
			throw new Error("`account` field is required");

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

		const initializeSOLtransfer = SystemProgram.transfer({
			fromPubkey: payer,
			toPubkey: TO_PUBKEY,
			lamports: 0.01 * LAMPORTS_PER_SOL,
		});

		const message = new TransactionMessage({
			payerKey: payer,
			recentBlockhash: blockhash,
			instructions: [initializeSOLtransfer],
		}).compileToV0Message();

		const tx = new VersionedTransaction(message);

		const payload: ActionPostResponse = await createPostResponse({
			fields: {
				transaction: tx,
				links: {
					next: {
						type: "post",
						href: `${URL_PATH}/mint/${username}`,
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
