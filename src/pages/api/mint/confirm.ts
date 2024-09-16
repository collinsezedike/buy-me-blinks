import type { NextApiRequest, NextApiResponse } from "next";
import { clusterApiUrl, Connection, Transaction } from "@solana/web3.js";

import { addNewUsernameWallet } from "../../../utils";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}
	try {
		const username: any = req.query.username;
		const { signedTransaction } = req.body;

		if (!signedTransaction?.trim() || !username?.trim()) {
			return res.status(400).json({
				error: "Signed transaction and username are required",
			});
		}

		// Decode the signed transaction from base64
		const transactionBuffer = Buffer.from(signedTransaction, "base64");
		const transaction = Transaction.from(transactionBuffer);

		// Create a connection to the Solana network
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

		// Send the transaction and get the signature
		const signature = await connection.sendTransaction(transaction, [], {
			skipPreflight: false,
			preflightCommitment: "confirmed", // Can be 'confirmed' or 'finalized'
		});

		// Confirm the transaction with a commitment level
		await connection.confirmTransaction(signature, "confirmed"); // or 'finalized'

		// Call addNewUsernameWallet if the transaction is confirmed
		addNewUsernameWallet(username, transaction.feePayer!.toBase58());

		return res.status(200).json({ signature });
	} catch (err: any) {
		return res.status(500).json({ error: err.message });
	}
}
