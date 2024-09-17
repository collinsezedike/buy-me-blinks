import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	return NextResponse.json("gm! world.", { status: 200 });
}
