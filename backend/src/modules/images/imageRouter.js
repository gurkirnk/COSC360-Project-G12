import { Router } from "express";
import { getImageByIdController } from "./imageController.js";

const imageRouter = Router();

imageRouter.get("/:id", getImageByIdController);

export default imageRouter;
