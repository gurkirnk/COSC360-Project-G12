import { newListing, modifyListing, removeListing, retrieveListings, retrieveListingsByUserId, retrieveListingsById } from "./listService.js";

export async function createListing(req, res) {
  try {
    const { title, genre, format, description } = req.body;
    const userId = req.user?.sub;
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
    const userId = req.user?.sub;
    const result = await modifyListing({ title, genre, format, description, listingId, userId });
    return res.status(201).json({ message: "Edit Successful", data: result });
  } catch (error) {
    console.error("listController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
};
    
export async function deleteListing(req, res) {
  try {
    const { listingId } = req.body;
    const userId = req.user?.sub;
    const result = await removeListing(listingId, userId);
    return res.status(201).json({ message: "Deletion Successful", data: result });
  } catch (error) {
    console.error("listController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
};

export async function getListings(req, res) {
  try {
    const {search, genre} = req.query;
    const result = await retrieveListings({search, genre});
    
    return res.status(200).json({
      message: "Retrieved all matching listings",
      data: result,
    });
  } catch (error) {
    console.error("retrieveListings error:", error);

    return res.status(500).json({
      message: "Could not retrieve listings",
    });
  }
}
export async function getListingsByUserId(req, res) {
  try {
    const id = req.query;
    const result = await retrieveListingsByUserId(id);
    
    return res.status(200).json({
      message: "Retrieved all matching listings",
      data: result,
    });
  } catch (error) {
    console.error("retrieveListings error:", error);

    return res.status(500).json({
      message: "Could not retrieve listings",
    });
  }
}

export async function getListingsById(req, res) {
  try {
    const id = req.query;
    const result = await retrieveListingsById(id);
    
    return res.status(200).json({
      message: "Retrieved all matching listings",
      data: result,
    });
  } catch (error) {
    console.error("retrieveListings error:", error);

    return res.status(500).json({
      message: "Could not retrieve listings",
    });
  }
}
