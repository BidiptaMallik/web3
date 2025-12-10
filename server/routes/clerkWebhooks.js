

import express from "express";
import {clerkWebhooks} from "../controllers/webhooks.js";

const router = express.Router();

router.post("/", clerkWebhooks);

export default router;
