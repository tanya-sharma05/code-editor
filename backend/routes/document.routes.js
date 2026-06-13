import {Router} from "express";
import { addCollaborator, createDocument, getUserDocuments } from "../controllers/document.controllers.js";
import verifyUser from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", verifyUser, createDocument);
router.get("/", verifyUser, getUserDocuments);
router.post("/:documentId/collaborators", verifyUser, addCollaborator);

export default router;