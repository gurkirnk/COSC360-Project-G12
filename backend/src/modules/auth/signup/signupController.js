import { signup } from "./signupService.js";

export const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //TODO: are we doing profile pictures? if so, need to change here to handle file upload
    const result = await signup({ name, email, password });
    return res.status(201).json({ message: "User created successfully", data: result });
  } catch (error) {
    console.error("signupController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
};
