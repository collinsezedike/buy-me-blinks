import { Request, Response } from "express";
import {
	ActionPostRequest,
	ActionPostResponse,
	ACTIONS_CORS_HEADERS,
	createPostResponse,
	MEMO_PROGRAM_ID,
} from "@solana/actions";
import {
	clusterApiUrl,
	ComputeBudgetProgram,
	Connection,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	Transaction,
	TransactionInstruction,
} from "@solana/web3.js";

const DEFAULT_NOTE = "Thank you for all you do and more!";
const TO_PUBKEY = new PublicKey("tapBQPn3C3tetbjg1pHEBeXuU37rECQiTfrALGpxNhH");

const POST = async (req: Request, res: Response) => {
	try {
		const request: ActionPostRequest = req.body;

		if (!request?.account?.trim()) {
			throw new Error("`account` field is required");
		}
		let account: PublicKey;
		try {
			account = new PublicKey(request.account);
		} catch (err: any) {
			throw new Error("invalid account provided: not a valid public key");
		}

		let { amount, note }: any = req.query;
		if (!note?.toString().trim()) note = DEFAULT_NOTE;
		if (!amount?.toString().trim()) {
			throw new Error("`amount` parameter is required");
		}
		amount = parseFloat(amount);
		if (Number.isNaN(amount)) {
			throw new Error("Invalid `amount` parameter");
		}

		const transaction = new Transaction();
		transaction.feePayer = account;
		transaction.add(
			SystemProgram.transfer({
				fromPubkey: account,
				lamports: amount * LAMPORTS_PER_SOL,
				toPubkey: TO_PUBKEY,
			})
		);
		const connection = new Connection(clusterApiUrl("devnet"));
		transaction.recentBlockhash = (
			await connection.getLatestBlockhash()
		).blockhash;

		const payload: ActionPostResponse = await createPostResponse({
			fields: {
				transaction,
				message: "Hello from the other end of the blink. 👀",
			},
		});
		return res.set(ACTIONS_CORS_HEADERS).status(200).json(payload);
	} catch (err: any) {
		return res.set(ACTIONS_CORS_HEADERS).status(400).json(err.message);
	}
};

export default POST;
