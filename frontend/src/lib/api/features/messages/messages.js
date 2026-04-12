import { apiClient } from "../../api-client";

export async function createConversation({ listingId }) {
  const response = await apiClient("/api/messages/conversations", {
    method: "POST",
    body: {
      listingId,
    },
  });

  return response.data;
}

export async function getConversation(conversationId) {
  const response = await apiClient(`/api/messages/conversations/${conversationId}`, {
    method: "GET",
  });

  return response.data;
}

export async function getConversations() {
  const response = await apiClient("/api/messages/conversations", {
    method: "GET",
  });

  return response.data;
}

export async function sendMessage(conversationId, { body }) {
  const response = await apiClient(`/api/messages/conversations/${conversationId}/messages`, {
    method: "POST",
    body: {
      body,
    },
  });

  return response.data;
}
