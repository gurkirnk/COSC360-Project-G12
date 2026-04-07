import { findUserById, removeUserById } from "../authAndUserRepository.js";
import { deleteListing, findListingById } from "../../listing/listRepository.js";
export async function adminRemoveUserById(id) {

    const results = await removeUserById(id);

    return {
        results: results,
    };
}
export async function adminRemoveListing(id){
  const listing = await findListingById(id);
  if (!listing) throw Object.assign(new Error("Listing not found"), { statusCode: 404 });

  const results = await deleteListing(id);

  return {
    results: results,
  };
}
export async function adminRetrieveUserById(id){
  const results = await findUserById(id);
  if (!results) throw Object.assign(new Error("User not found"), { statusCode: 404 });

  return {
    results: results,
  };
}