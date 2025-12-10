import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import clerkWebhooksRouter from "./routes/clerkWebhooks.js";

const app = express();

await connectDB();

app.use(cors());

app.use("/clerk", express.raw({ type: "application/json" }), clerkWebhooksRouter);

app.use(express.json());

app.get("/", (req, res) => res.send("API Working"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
