import { Router } from "express";
import { createComment, getCommentChain } from "./commentController.js";
import { requireAuth } from "../auth/tokens/authMiddleware.js";

const commentRoutes = Router();

commentRoutes.get("/", getCommentChain);
commentRoutes.post("/", requireAuth, createComment);

export default commentRoutes;
