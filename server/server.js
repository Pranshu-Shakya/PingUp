import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import { inngest, functions } from "inngest";
import { serve } from "inngest/express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 4000;

await connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send("PingUp Server is running!");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
