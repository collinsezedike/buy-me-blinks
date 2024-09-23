import { NextRequest, NextResponse } from "next/server";
import { ActionsJson, createActionHeaders } from "@solana/actions";

const HEADERS = createActionHeaders();

export async function GET(req: NextRequest) {
	const payload: ActionsJson = {
		rules: [
			// map all root level routes to an action
			{
				pathPattern: "/mint/*",
				apiPath: "/api/actions/mint/*",
			},
			{
				pathPattern: "/appreciate/**",
				apiPath: "/api/actions/appreciate/**",
			},
			// idempotent rule as the fallback
			{
				pathPattern: "/api/actions/**",
				apiPath: "/api/actions/**",
			},
		],
	};
	return NextResponse.json(payload, { status: 200, headers: HEADERS });
}

export const OPTIONS = GET;
