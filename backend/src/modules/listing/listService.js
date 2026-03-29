import {
  createListing,
  editListing,
  deleteListing,
  findListingById,
  getListings,
  getListingsByUserId,
  getListingsById,
} from "./listRepository.js";

export async function newListing({title, genre, format, description, userId}) {

  if(!title || !genre || !format) throw Object.assign(new Error("Title, genre, and format are required"), { statusCode: 400 });
  if(!(format == "Paperback" || format == "Hardcover" || format == "Mass Market Paperback")) throw Object.assign(new Error("Illegal Format"), { statusCode: 400 });
  const results = await createListing({title, genre, format, description, userId});

  return {
    results: results,
  };
}

// Ensure only owner can modify
export async function modifyListing({ title, genre, format, description, listingId, userId }) {
  const listing = await findListingById(listingId);
  if (!listing) throw Object.assign(new Error("Listing not found"), { statusCode: 404 });
  if (listing.userId !== userId) throw Object.assign(new Error("Forbidden"), { statusCode: 403 });

  if(!title || !genre || !format) throw Object.assign(new Error("Title, genre, and format are required"), { statusCode: 400 });
  if(!(format == "Paperback" || format == "Hardcover" || format == "Mass Market Paperback")) throw Object.assign(new Error("Illegal Format"), { statusCode: 400 });
  const results = await editListing({ title, genre, format, description, listingId, userId });

  return {
    results: results,
  };
}

// Ensure only owner can delete
export async function removeListing(listingId, userId) {
  const listing = await findListingById(listingId);
  if (!listing) throw Object.assign(new Error("Listing not found"), { statusCode: 404 });
  if (listing.userId !== userId) throw Object.assign(new Error("Forbidden"), { statusCode: 403 });

  const results = await deleteListing(listingId, userId);

  return {
    results: results,
  };
}

export async function retrieveListings({search, genre}) {
  const results = await getListings({search, genre});

  return {
    results: results,
  };
}

export async function retrieveListingsByUserId(id) {
  const results = await getListingsByUserId(id);

  return {
    results: results,
  };
}
export async function retrieveListingsById(id) {
  const results = await getListingsById(id);

  return {
    results: results,
  };
}