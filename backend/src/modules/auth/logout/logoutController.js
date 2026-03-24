export const logoutController = async (req, res) => {
  try {
    // With stateless JWTs there's nothing to do server-side by default.
    // For demonstration we simply acknowledge logout; clients should clear stored tokens.
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logoutController error:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};
