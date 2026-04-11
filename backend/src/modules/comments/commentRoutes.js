import { Router } from "express";
import { createComment, getCommentChain, removeComment } from "./commentController.js";
import { requireAuth } from "../auth/tokens/authMiddleware.js";

const commentRoutes = Router();

commentRoutes.get("/", getCommentChain);
commentRoutes.post("/", requireAuth, createComment);
commentRoutes.delete("/", requireAuth, removeComment);

export default commentRoutes;
