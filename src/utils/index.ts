import fs from "fs";
import path from "path";

const FILEPATH = path.join(process.cwd(), "src", "data.yml");

export const PORT = process.env.PORT || 3000;
export const PROGRAM_ACCOUNT = process.env.PROGRAM_ACCOUNT || "";

export const getUsernameWallet = (username: string) => {
	try {
		const data = fs.readFileSync(FILEPATH);
		const dataObject = JSON.parse(data.toString().replace("/n", ""));
		return dataObject[username] ? dataObject[username] : PROGRAM_ACCOUNT;
	} catch (err: any) {
		throw err;
	}
};

export const addNewUsernameWallet = (username: string, wallet: string) => {
	try {
		const data = fs.readFileSync(FILEPATH);
		const dataObject = JSON.parse(data.toString().replace("/n", ""));
		dataObject[username] = wallet;
		fs.writeFileSync(FILEPATH, JSON.stringify(dataObject, null, 4));
	} catch (err: any) {
		throw err;
	}
};

import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";

async function confirmTransaction(txnHash: string, username: string) {
	try {
		const response = await fetch("/api/confirm-transaction", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ txnHash, username }),
		});

		const result = await response.json();

		if (response.ok) {
			console.log(
				"Transaction confirmed with signature:",
				result.signature
			);
		} else {
			console.error("Error confirming transaction:", result.error);
		}
	} catch (error) {
		console.error("Network error:", error);
	}
}

// Example usage
const txnHash = "base64_encoded_signed_transaction_here"; // Replace with actual transaction hash
const username = "desired_username"; // Replace with actual username
confirmTransaction(txnHash, username);
