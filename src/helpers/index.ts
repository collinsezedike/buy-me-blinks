import fs from "fs";
import path from "path";
import { createActionHeaders } from "@solana/actions";
import { clusterApiUrl } from "@solana/web3.js";

const FILEPATH = path.join(process.cwd(), "data.yml");

// CONSTANTS
export const URL_PATH = "/api/actions";
export const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl("devnet");
export const HEADERS = createActionHeaders({ chainId: "devnet" });

// FUNCTIONS
export const getUsernameWallet = (username: string): string => {
	try {
		const data = fs.readFileSync(FILEPATH);
		const dataObject = JSON.parse(data.toString().replace("/n", ""));
		return dataObject[username]
			? dataObject[username]
			: (process.env.PROGRAM_ACCOUNT as string);
	} catch (err: any) {
		throw err;
	}
};

export const setUsernameWallet = (username: string, wallet: string) => {
	try {
		const data = fs.readFileSync(FILEPATH);
		const dataObject = JSON.parse(data.toString().replace("/n", ""));
		dataObject[username] = wallet;
		fs.writeFileSync(FILEPATH, JSON.stringify(dataObject, null, 4));
	} catch (err: any) {
		throw err;
	}
};
