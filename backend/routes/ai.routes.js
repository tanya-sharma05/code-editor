import {Router} from "express";
import verifyUser from "../middleware/auth.middleware.js";
import explainCode from "../controllers/ai.controllers.js";


const router = Router();
router.post("/explain", verifyUser, explainCode);

export default router;