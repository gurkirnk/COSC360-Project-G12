import { newListing, modifyListing, removeListing } from "./listService.js";

export async function createListing(req, res) {
  try {
    const { title, genre, format, description, userId } = req.body;
    const result = await newListing({ title, genre, format, description, userId });
    return res.status(201).json({ message: "Listing created successfully", data: result });
  } catch (error) {
    console.error("listController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
};

export async function editListing(req, res) {
  try {
    const { title, genre, format, description, listingId } = req.body;
    const result = await modifyListing({ title, genre, format, description, listingId });
    return res.status(201).json({ message: "Edit Successful", data: result });
  } catch (error) {
    console.error("listController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
};
    
export async function deleteListing(req, res) {
  try {
    const {listingId} = req.body;
    const result = await removeListing(listingId);
    return res.status(201).json({ message: "Deletion Successful", data: result });
  } catch (error) {
    console.error("listController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
};
