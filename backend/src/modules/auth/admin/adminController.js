import {adminRemoveUserById} from "./adminService.js"
export async function adminStatus(req, res){
  try {
    // req.user is set by requireAdminAuth
    return res.status(200).json({ message: "Hello admin", user: req.user });
  } catch (err) {
    console.error("adminController error:", err);
    return res.status(500).json({ message: "Failed" });
  }
};

export async function adminRemoveUser(req, res){
  try {
    const id = req.body;
    const result = await adminRemoveUserById(id);
    return res.status(201).json({ message: "Deletion Successful", data: result });
  } catch (err) {
    console.error("adminController error:", err);
    return res.status(500).json({ message: err.message});
  }
};
