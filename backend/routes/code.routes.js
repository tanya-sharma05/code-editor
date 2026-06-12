import express from "express";
import runCode from "../controllers/code.controllers.js";
import verifyUser from "../middleware/auth.middleware.js";

const codeRouter = express.Router();

// POST /api/code/run
// Protected — user must be logged in
codeRouter.post("/run", verifyUser, runCode);

export default codeRouter;