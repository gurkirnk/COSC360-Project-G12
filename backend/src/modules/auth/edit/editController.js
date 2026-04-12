import { edit } from "./editService.js";

export const editController = async (req, res) => {
  try {
    const { name, email, password, profilePicture, id } = req.body;
    const result = await edit({ name, email, password, profilePicture, id });
    return res.status(201).json({ message: "User edited successfully", data: result });
  } catch (error) {
    console.error("editController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
};
