import { NextRequest, NextResponse } from "next/server";
import {
	ActionGetResponse,
	ActionPostRequest,
	ActionPostResponse,
	ACTIONS_CORS_HEADERS,
	createPostResponse,
} from "@solana/actions";
import {
	clusterApiUrl,
	Connection,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	VersionedTransaction,
	TransactionMessage,
} from "@solana/web3.js";

// import { PROGRAM_ACCOUNT, getUsernameWallet } from "../../../utils";
const URL_PATH = "/api/actions";
const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl("devnet");
const TO_PUBKEY = new PublicKey(process.env.PROGRAM_ACCOUNT!);

export async function GET(req: NextRequest) {
	const payload: ActionGetResponse = {
		title: "Buy Me Blinks",
		icon: `${new URL(req.url).origin}/buymeblinkslogo.jpg`,
		description:
			"Mint a unique username for receiving appreciation via BuyMeBlinks.\n\nEnsure you are on devnet as some SOL will be airdropped to your wallet for gas fee",
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

	return NextResponse.json(payload, {
		status: 200,
		headers: ACTIONS_CORS_HEADERS,
	});
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

		return NextResponse.json(payload, {
			status: 200,
			headers: ACTIONS_CORS_HEADERS,
		});
	} catch (err: any) {
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 400 }
		);
	}
}

export const OPTIONS = GET;
