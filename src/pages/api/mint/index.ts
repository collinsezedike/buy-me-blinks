import type { NextApiRequest, NextApiResponse } from "next";
import {
	clusterApiUrl,
	Connection,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	Transaction,
} from "@solana/web3.js";

import { PROGRAM_ACCOUNT, getUsernameWallet } from "../../../utils";

const TO_PUBKEY = new PublicKey(PROGRAM_ACCOUNT);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		const username: any = req.query.username;

		if (!username?.trim()) {
			throw new Error("Invalid username: username wasn't provided");
		} else if (getUsernameWallet(username)) {
			throw new Error("Invalid username: username is already taken");
		}

		let account: PublicKey;
		try {
			account = new PublicKey(req.body.account);
		} catch (err: any) {
			throw new Error("Invalid account provided: not a valid public key");
		}

		const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
		const { blockhash } = await connection.getLatestBlockhash();

		const transaction = new Transaction();
		transaction.recentBlockhash = blockhash;
		transaction.feePayer = account;
		transaction.add(
			SystemProgram.transfer({
				fromPubkey: account,
				lamports: 0.01 * LAMPORTS_PER_SOL,
				toPubkey: TO_PUBKEY,
			})
		);

		const serializedTransaction = transaction
			.serialize({ requireAllSignatures: false, verifySignatures: false })
			.toString("base64");

		return res.status(200).json({ transaction: serializedTransaction });
	} catch (err: any) {
		return res.status(400).json({ error: err.message });
	}
}
