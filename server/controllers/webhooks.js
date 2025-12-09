import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify the webhook using the raw body
    await whook.verify(req.rawBody, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    // Helper to get email safely
    const getEmail = (data) =>
      data.email_addresses && data.email_addresses.length > 0
        ? data.email_addresses[0].email_address
        : data.email_address || "no-email@example.com";

    switch (type) {
      case "user.created": {
        await User.create({
          _id: data.id,
          email: getEmail(data),
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        res.status(200).json({ received: true });
        break;
      }

      case "user.updated": {
        await User.findByIdAndUpdate(data.id, {
          email: getEmail(data),
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        res.status(200).json({ received: true });
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.status(200).json({ received: true });
        break;
      }

      default: {
        // Unknown event type
        res.status(200).json({ received: true });
        break;
      }
    }
  } catch (error) {
    console.log("Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
