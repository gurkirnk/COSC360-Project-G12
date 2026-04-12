import { findUserByEmail, findUserByName, findUserById, removeUserById } from "../authAndUserRepository.js";
import { deleteListing, findListingById } from "../../listing/listRepository.js";
import { getDb } from "../../../db/mongoClient.js";

const ANALYTICS_LIMIT = 5;

function buildTopListingsPipeline(countFieldName) {
  return [
    {
      $match: {
        listingId: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$listingId",
        [countFieldName]: { $sum: 1 },
      },
    },
    {
      $sort: {
        [countFieldName]: -1,
        _id: 1,
      },
    },
    {
      $limit: ANALYTICS_LIMIT,
    },
    {
      $lookup: {
        from: "listings",
        localField: "_id",
        foreignField: "_id",
        as: "listing",
      },
    },
    {
      $unwind: {
        path: "$listing",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        listingId: { $toString: "$_id" },
        title: {
          $ifNull: ["$listing.title", "Unknown listing"],
        },
        genre: "$listing.genre",
        format: "$listing.format",
        description: "$listing.description",
        createdAt: "$listing.createdAt",
        userId: "$listing.userId",
        [countFieldName]: 1,
      },
    },
  ];
}
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
export async function adminRetrieveUserByName(name){
  const results = await findUserByName(name);
  if (!results) throw Object.assign(new Error("User not found"), { statusCode: 404 });

  return {
    results: results,
  };
}
export async function adminRetrieveUserByEmail(email){
  const results = await findUserByEmail(email);
  if (!results) throw Object.assign(new Error("User not found"), { statusCode: 404 });

  return {
    results: results,
  };
}

export async function adminRetrieveAnalytics() {
  const db = await getDb();

  const [mostReservedBooks, mostCommentedBooks] = await Promise.all([
    db
      .collection("reservations")
      .aggregate(buildTopListingsPipeline("reservationCount"))
      .toArray(),
    db
      .collection("comments")
      .aggregate(buildTopListingsPipeline("commentCount"))
      .toArray(),
  ]);

  return {
    results: {
      mostReservedBooks,
      mostCommentedBooks,
    },
  };
}
