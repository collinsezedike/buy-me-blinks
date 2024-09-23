import { NextRequest, NextResponse } from "next/server";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import {
	NextActionPostRequest,
	ActionError,
	CompletedAction,
	ACTIONS_CORS_HEADERS,
} from "@solana/actions";

import { setUsernameWallet } from "@/utils";

const URL_PATH = "/api/actions";
const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl("devnet");

export const GET = async (req: NextRequest) => {
	return NextResponse.json(
		{ message: "Method not supported" } as ActionError,
		{ status: 403, headers: ACTIONS_CORS_HEADERS }
	);
};

export const OPTIONS = async () => {
	return NextResponse.json(null, {
		headers: ACTIONS_CORS_HEADERS,
	});
};

export const POST = async (
	req: NextRequest,
	context: { params: { username: string } }
) => {
	try {
		const body: NextActionPostRequest = await req.json();

		let account: PublicKey;
		try {
			account = new PublicKey(body.account);
		} catch (err) {
			throw new Error("Invalid account provided: not a valid public key");
		}

		let signature: string;
		try {
			signature = body.signature;
			if (!signature) throw new Error("No signature provided");
		} catch (err) {
			throw new Error("Invalid signature provided");
		}

		const connection = new Connection(CLUSTER_URL);

		try {
			let status = await connection.getSignatureStatus(signature);
			if (!status) throw new Error("Unknown signature status");
			// only accept `confirmed` and `finalized` transactions
			if (status.value?.confirmationStatus) {
				if (
					status.value.confirmationStatus != "confirmed" &&
					status.value.confirmationStatus != "finalized"
				) {
					throw new Error("Unable to confirm the transaction");
				}
			}
		} catch (err) {
			throw err;
		}

		const url = new URL(req.url);
		const username = context.params.username;

		setUsernameWallet(username, account.toString());

		const payload: CompletedAction = {
			type: "completed",
			title: "Blink mint was successful!",
			icon: `${new URL(req.url).origin}/buymeblinkslogo.jpg`,
			label: "Complete!",
			description: `Here is your unique blink url: ${url.origin}${URL_PATH}/appreciate/${username}`,
		};

		return NextResponse.json(payload, {
			status: 201,
			headers: ACTIONS_CORS_HEADERS,
		});
	} catch (err: any) {
		return NextResponse.json({ message: err.message } as ActionError, {
			status: 400,
			headers: ACTIONS_CORS_HEADERS,
		});
	}
};
