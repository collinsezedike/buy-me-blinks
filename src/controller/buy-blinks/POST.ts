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

const TO_PUBKEY = new PublicKey("tapBQPn3C3tetbjg1pHEBeXuU37rECQiTfrALGpxNhH");

const POST = async (req: Request, res: Response) => {
	try {
		const request: ActionPostRequest = req.body;
		if (!request?.account?.trim()) {
			return res
				.set(ACTIONS_CORS_HEADERS)
				.status(400)
				.json("Account is required");
		}

		let account: PublicKey;
		try {
			account = new PublicKey(request.account);
		} catch (err: any) {
			return res
				.set(ACTIONS_CORS_HEADERS)
				.status(400)
				.json("Invalid account");
		}

		const transaction = new Transaction();
		transaction.add(
			SystemProgram.transfer({
				fromPubkey: account,
				lamports: 0.1 * LAMPORTS_PER_SOL,
				toPubkey: TO_PUBKEY,
			})
		);
		transaction.feePayer = account;
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
		return res
			.set(ACTIONS_CORS_HEADERS)
			.status(400)
			.json("Something went wrong");
	}
};

export default POST;
