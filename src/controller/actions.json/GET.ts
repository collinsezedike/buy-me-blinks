import { Request, Response } from "express";
import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

const GET = async (req: Request, res: Response) => {
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
  return res.set(ACTIONS_CORS_HEADERS).json(payload);
};

export default GET;
