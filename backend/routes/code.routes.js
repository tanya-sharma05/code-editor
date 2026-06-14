import {Router} from "express";
import verifyUser from "../middleware/auth.middleware.js";
import runCode from "../controllers/code.controllers.js";

const router = Router();

router.post("/run", verifyUser, runCode);

export default router;
