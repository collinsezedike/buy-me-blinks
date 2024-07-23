import { Request, Response } from "express";
import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";

const GET = async (req: Request, res: Response) => {
    const payload : ActionGetResponse = {
        icon: "https://public.bnbstatic.com/image/pgc/202405/eb0d36f33e00ebd0bc79425adb5dc419.png",
        title: "SAY BLINK!",
        description: "My first blink.",
        label: "Blink now!",
        error: {
            message: "This blink is not yet implemented.",
        },
    };
    return res.set(ACTIONS_CORS_HEADERS).json(payload)
}

export default GET;