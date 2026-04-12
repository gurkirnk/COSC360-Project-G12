import {
  cancelReservation,
  completeReservation,
  createReservation,
  retrieveReservationsByBorrowerUserId,
} from "./reservationService.js";

export async function getUserReservations(req, res) {
  try {
    const result = await retrieveReservationsByBorrowerUserId(req.user?.sub);

    return res.status(200).json({
      message: "Reservations retrieved",
      data: result,
    });
  } catch (error) {
    console.error("reservationController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export async function createListingReservation(req, res) {
  try {
    const result = await createReservation({
      listingId: req.body?.listingId,
      borrowerUserId: req.body?.borrowerUserId,
      ownerUserId: req.user?.sub,
      conversationId: req.body?.conversationId,
      durationDays: req.body?.durationDays,
    });

    return res.status(201).json({
      message: "Reservation created",
      data: result,
    });
  } catch (error) {
    console.error("reservationController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export async function cancelListingReservation(req, res) {
  try {
    const result = await cancelReservation(req.params?.reservationId, req.user?.sub);

    return res.status(200).json({
      message: "Reservation cancelled",
      data: result,
    });
  } catch (error) {
    console.error("reservationController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}

export async function completeListingReservation(req, res) {
  try {
    const result = await completeReservation(req.params?.reservationId, req.user?.sub);

    return res.status(200).json({
      message: "Reservation completed",
      data: result,
    });
  } catch (error) {
    console.error("reservationController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}
