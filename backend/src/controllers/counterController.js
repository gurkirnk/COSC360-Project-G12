import { addOneToCounter } from "../services/counterService.js";

export async function incrementCounter(req, res) {
  try {
    if (req.body && Object.keys(req.body).length > 0) {
      return res.status(400).json({
        message: "This endpoint does not accept a request body.",
      });
    }

    const result = await addOneToCounter();

    return res.status(201).json({
      message: "Saved +1 to database",
      data: result,
    });
  } catch (error) {
    console.error("incrementCounter error:", error);

    return res.status(500).json({
      message: "Could not save counter value",
    });
  }
}
