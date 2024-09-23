import { NextRequest, NextResponse } from "next/server";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import {
	ActionError,
	CompletedAction,
	createActionHeaders,
	NextActionPostRequest,
} from "@solana/actions";

const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl("devnet");
const HEADERS = createActionHeaders();

export const GET = async (req: NextRequest) => {
	return NextResponse.json(
		{ message: "Method not supported" } as ActionError,
		{ status: 403, headers: HEADERS }
	);
};

export const OPTIONS = async () => {
	return NextResponse.json(null, { status: 200, headers: HEADERS });
};

export const POST = async (
	req: NextRequest,
	context: { params: { username: string } }
) => {
	try {
		const body: NextActionPostRequest = await req.json();

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

		const username = context.params.username;

		const payload: CompletedAction = {
			type: "completed",
			title: "Thank you!",
			icon: `${new URL(req.url).origin}/buymeblinkslogo.jpg`,
			label: "Complete!",
			description: `@${username} appreciates you in turn for your kindness`,
		};

		return NextResponse.json(payload, { status: 201, headers: HEADERS });
	} catch (err: any) {
		return NextResponse.json({ message: err.message } as ActionError, {
			status: 400,
			headers: HEADERS,
		});
	}
};
