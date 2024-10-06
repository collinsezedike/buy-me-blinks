import { NextRequest, NextResponse } from "next/server";

import { URL_PATH } from "@/helpers";

export const GET = async (
	req: NextRequest,
	context: { params: { username: string } }
) => {
	const prefix = "https://dial.to/?action=solana-action:";
	const { origin } = new URL(req.url);
	const { username } = context.params;
	const actionURL = new URL(
		`${prefix}${origin}${URL_PATH}/appreciate/${username}&cluster=mainnet`
	);
	return NextResponse.redirect(actionURL);
};
