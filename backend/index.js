import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import documentRouter from "./routes/document.routes.js";
import aiRouter from "./routes/ai.routes.js";

await connectDB();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    console.log("Server is live!");
});

app.get("/api", (req, res) => {
    console.log("API is running!");
});

app.use("/api/auth", userRouter);
app.use("/api/docs", documentRouter);
app.use("/api/ai", aiRouter); 

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});