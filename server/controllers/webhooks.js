import User from "../models/User.js";
import { Webhook } from "svix"; 

export const clerkWebhooks = async (req, res) => {
  try {

    const payloadString = req.body.toString();
    const svixHeaders = req.headers;

    const evt = JSON.parse(payloadString);

    const { data, type } = evt;


    const getEmail = (d) => {

       return d.email_addresses?.[0]?.email_address || d.email_address;
    };


    switch (type) {
      case "user.created":
        await User.create({
          _id: data.id,
          email: getEmail(data),
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        console.log("User created:", data.id);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, {
          email: getEmail(data),
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        console.log("User updated:", data.id);
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("User deleted:", data.id);
        break;

      default:
        console.log("Unhandled webhook type:", type);
    }

    res.status(200).json({ success: true });
    
  } catch (err) {
    console.log("Webhook error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};
