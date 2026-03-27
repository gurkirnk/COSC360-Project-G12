import {
  createListing,
  editListing,
  deleteListing,
} from "./listRepository.js";

//TODO: Presumably format, genre, will be limited to certain values at some point, checking for that should go here.
export async function newListing({title, genre, format, description, userId}) {
  const results = await createListing({title, genre, format, description, userId});
  
  return {
    results: results,
  };
}
//TODO: security so you can't modify listings not belonging to you
export async function modifyListing({title, genre, format, description, listingId }) {
  const results = await editListing({title, genre, format, description, listingId});
  
  return {
    results: results,
  };
}

//TODO: security so you can't modify listings not belonging to you
export async function removeListing(listingId) {
  const results = await deleteListing(listingId);
  
  return {
    results: results,
  };
}