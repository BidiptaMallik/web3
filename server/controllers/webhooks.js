import express from "express";
import { Webhook } from "svix";
import User from "../models/User.js";

const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // const evt = whook.verify(req.body, {
    //   "svix-id": req.headers["svix-id"],
    //   "svix-timestamp": req.headers["svix-timestamp"],
    //   "svix-signature": req.headers["svix-signature"]
    // });

    const { data, type } = evt;

    const getEmail = d => 
      d.email_addresses?.[0]?.email_address || d.email_address;

    switch (type) {
      case "user.created":
        await User.create({
          _id: data.id,
          email: getEmail(data),
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url
        });
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, {
          email: getEmail(data),
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url
        });
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.log("Webhook error:", err.message);
    res.status(400).json({ success: false });
  }
});

export default router;
