import { login } from "./loginService.js";

export const loginController = async (req, res) => {
  try {
    const {email, password } = req.body;
    //TODO: are we doing profile pictures? if so, need to change here to handle file upload
    const result = await login({ email, password });
    return res.status(201).json({ message: "Logged in successfully", data: result });
  } catch (error) {
    console.error("loginController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
};
