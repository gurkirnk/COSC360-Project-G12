import { apiClient } from "../../api-client";

export async function getCommentChainForListing(listingId) {
  const params = { listingId };
  const query = new URLSearchParams(params).toString();

  const response = await apiClient(`/api/comments?${query}`, {
    method: "GET",
  });

  return response.data;
}

export async function createComment({ body, listingId, parentCommentId }) {
  const response = await apiClient(`/api/comments`, {
    method: "POST",
    body: {
      body,
      ...(listingId ? { listingId } : {}),
      ...(parentCommentId ? { parentCommentId } : {}),
    },
  });

  return response.data;
}

export async function deleteComment(commentId) {
  const response = await apiClient(`/api/comments`, {
    method: "DELETE",
    body: {
      commentId,
    },
  });

  return response.data;
}
