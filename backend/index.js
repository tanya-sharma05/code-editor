import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();

await connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req,res) => {
    console.log("Server is live...");
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})