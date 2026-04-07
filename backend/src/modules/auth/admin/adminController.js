import {adminRemoveUserById, adminRemoveListing, adminRetrieveUserById} from "./adminService.js"
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
    const id = req.body.id;
    const result = await adminRemoveUserById(id);
    return res.status(201).json({ message: "Deletion Successful", data: result });
  } catch (err) {
    console.error("adminController error:", err);
    return res.status(500).json({ message: err.message});
  }
};

export async function adminDeleteListing(req,res){
  try {
    const id = req.body.id;
    const result = await adminRemoveListing(id);
    return res.status(201).json({ message: "Deletion Successful", data: result });
  } catch (err) {
    console.error("adminController error:", err);
    return res.status(500).json({ message: err.message});
  }
}
export async function adminGetUser(req,res){
  try {
      const id = req.query.id;
      const result = await adminRetrieveUserById(id);
      
      return res.status(200).json({
        message: "Retrieved matching user",
        data: result,
      });
    } catch (error) {
      console.error("adminGetUser error:", error);
  
      return res.status(500).json({
        message: "Could not retrieve user",
      });
    }
}
