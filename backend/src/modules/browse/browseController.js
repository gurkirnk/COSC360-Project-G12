import { retrieveListings } from "./browseService.js";

export async function getListings(req, res) {
  try {
    //TODO: Use parameters
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
