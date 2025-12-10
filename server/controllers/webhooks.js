import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Use express.json() so Postman can send JSON normally
router.post("/", express.json(), async (req, res) => {
  try {
    const evt = req.body;               // already parsed JSON
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

      default:
        console.log("Unhandled webhook type:", type);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.log("Webhook error:", err.message);
    res.status(400).json({ success: false });
  }
});

export default router;
