import express, { Router, Request, Response } from "express";
import { actionsJson, buyBlinks } from "../controller";

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Buy Me Blinks ☕👀");
});

router.route("/actions.json").options(actionsJson.OPTIONS).get(actionsJson.GET);
router.route("/api/actions/buy-blinks").options(buyBlinks.OPTIONS).get(buyBlinks.GET);

export default router;
