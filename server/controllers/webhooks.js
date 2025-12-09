import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(req.rawBody, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    const getEmail = d => 
      d.email_addresses?.[0]?.email_address || d.email_address || "no-email@example.com";

    console.log("Webhook received:", type, "User:", getEmail(data));

    switch (type) {
      case "user.created":
        await User.create({
          _id: data.id,
          email: getEmail(data),
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        console.log("User created in DB");
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, {
          email: getEmail(data),
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        console.log("User updated in DB");
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("User deleted from DB");
        break;

      default:
        console.log("Unknown event type:", type);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.log("Webhook error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
