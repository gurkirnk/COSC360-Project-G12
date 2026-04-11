import { Router } from "express";
import { requireAuth } from "../auth/tokens/authMiddleware.js";
import {
  cancelListingReservation,
  completeListingReservation,
  createListingReservation,
} from "./reservationController.js";

const reservationRoutes = Router();

reservationRoutes.post("/", requireAuth, createListingReservation);
reservationRoutes.post("/:reservationId/cancel", requireAuth, cancelListingReservation);
reservationRoutes.post(
  "/:reservationId/complete",
  requireAuth,
  completeListingReservation
);

export default reservationRoutes;
