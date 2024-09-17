import { NextRequest, NextResponse } from "next/server";
import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export async function GET(req: NextRequest) {
	const payload: ActionsJson = {
		rules: [
			// map all root level routes to an action
			{
				pathPattern: "/*",
				apiPath: "/api/actions/*",
			},
			// idempotent rule as the fallback
			{
				pathPattern: "/api/actions/**",
				apiPath: "/api/actions/**",
			},
		],
	};
	return NextResponse.json(
		{ payload },
		{ status: 200, headers: ACTIONS_CORS_HEADERS }
	);
}

export const OPTIONS = GET;
