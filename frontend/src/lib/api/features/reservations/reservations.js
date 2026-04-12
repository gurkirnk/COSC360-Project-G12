import { apiClient } from "../../api-client";

export async function createReservation({
  listingId,
  borrowerUserId,
  conversationId,
  durationDays,
}) {
  const response = await apiClient("/api/reservations", {
    method: "POST",
    body: {
      listingId,
      borrowerUserId,
      conversationId,
      durationDays,
    },
  });

  return response.data;
}

export async function getUserReservations() {
  const response = await apiClient("/api/reservations/user", {
    method: "GET",
  });

  return response.data;
}

export async function cancelReservation(reservationId) {
  const response = await apiClient(`/api/reservations/${reservationId}/cancel`, {
    method: "POST",
  });

  return response.data;
}

export async function completeReservation(reservationId) {
  const response = await apiClient(`/api/reservations/${reservationId}/complete`, {
    method: "POST",
  });

  return response.data;
}
