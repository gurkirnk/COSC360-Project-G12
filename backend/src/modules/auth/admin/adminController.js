export const adminController = async (req, res) => {
  try {
    // req.user is set by requireAdminAuth
    return res.status(200).json({ message: "Hello admin", user: req.user });
  } catch (err) {
    console.error("adminController error:", err);
    return res.status(500).json({ message: "Failed" });
  }
};
