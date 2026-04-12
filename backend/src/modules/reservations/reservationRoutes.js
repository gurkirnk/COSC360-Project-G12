import { Router } from "express";
import { requireAuth } from "../auth/tokens/authMiddleware.js";
import {
  cancelListingReservation,
  completeListingReservation,
  createListingReservation,
  getUserReservations,
} from "./reservationController.js";

const reservationRoutes = Router();

reservationRoutes.get("/user", requireAuth, getUserReservations);
reservationRoutes.post("/", requireAuth, createListingReservation);
reservationRoutes.post("/:reservationId/cancel", requireAuth, cancelListingReservation);
reservationRoutes.post(
  "/:reservationId/complete",
  requireAuth,
  completeListingReservation
);

export default reservationRoutes;
