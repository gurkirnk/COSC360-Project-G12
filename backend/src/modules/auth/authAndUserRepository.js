import { connectMongoose } from "../../db/mongoClient.js";
import { User } from "./userModel.js";

export async function createUser({ name, email, password: hashedPassword, role, profilePictureLink = null }) {
  await connectMongoose();

  const user = await User.create({
    name,
    email,
    hashedPassword,
    role,
    profilePictureLink,
  });

  return user.toJSON();
}

export async function findUserByEmail(email) {
  await connectMongoose();

  const user = await User.findOne({ email });
  return user ? user.toJSON() : null;
}

export async function findUserByName(name) {
  await connectMongoose();

  const user = await User.findOne({ name });
  return user ? user.toJSON() : null;
}

export async function findUserCredentialsByEmail(email) {
  await connectMongoose();

  const user = await User.findOne({ email }).select("+hashedPassword");
  if (!user) {
    return null;
  }

  const credentials = user.toObject({ virtuals: false, transform: false });
  const { _id, ...rest } = credentials;

  return {
    id: _id.toString(),
    ...rest,
  };
}

export async function findUserById(id) {
  await connectMongoose();

  const user = await User.findById(id);
  return user ? user.toJSON() : null;
}
