import Stripe from "stripe";
import User from "../models/User.js";
import { Webhook } from "svix"; 
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

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
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const purchaseId = session.metadata.purchaseId;

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) return res.json({ received: true });

    await User.findByIdAndUpdate(
      purchase.userId,
      { $addToSet: { enrolledCourses: purchase.courseId } }
    );

    await Course.findByIdAndUpdate(
      purchase.courseId,
      { $addToSet: { enrolledStudents: purchase.userId } }
    );

    purchase.status = "completed";
    await purchase.save();
  }

  res.json({ received: true });
};