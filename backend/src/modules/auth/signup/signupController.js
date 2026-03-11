import { signup } from "./signupService.js";

export const signupController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await signup(username, password);
    return res.status(201).json({ message: "User created successfully", data: result });
  } catch (error) {
    console.error("signupController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
};