import { Router } from "express";
import { requireAuth } from "../auth/tokens/authMiddleware.js";
import {
  createConversation,
  createMessage,
  getConversation,
  getConversations,
} from "./messageController.js";

const messageRoutes = Router();

messageRoutes.get("/conversations", requireAuth, getConversations);
messageRoutes.post("/conversations", requireAuth, createConversation);
messageRoutes.get("/conversations/:conversationId", requireAuth, getConversation);
messageRoutes.post(
  "/conversations/:conversationId/messages",
  requireAuth,
  createMessage
);

export default messageRoutes;
