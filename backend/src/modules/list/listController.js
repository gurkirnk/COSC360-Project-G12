import { newListing } from "./listService.js";

export async function createListing(req, res) {
  try {
    const { title, genre, format, description, userId } = req.body;
    const result = await newListing({ title, genre, format, description, userId });
    return res.status(201).json({ message: "User created successfully", data: result });
  } catch (error) {
    console.error("signupController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
};
    

