import { connectMongoose } from "../../db/mongoClient.js";
import { User } from "./userModel.js";
import bcrypt from "bcrypt";

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

export async function editUser({ name, email, hashedPassword, role, profilePictureLink = null, id }) {
  await connectMongoose();

  const user = await User.findByIdAndUpdate(id, {name:name, email:email, hashedPassword:hashedPassword, role:role, profilePictureLink: profilePictureLink},  { new: true, runValidators: true });

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

export async function removeUserById(id) {
  await connectMongoose();
  
  const deletedUser = await User.findByIdAndDelete(id);
  return deletedUser? deletedUser.toJSON() : null;
}

export async function seedAdmin() {
  try {
    await connectMongoose();
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PWD, 10);
      await User.create({
        name: 'admin',
        email: process.env.ADMIN_EMAIL,
        hashedPassword: hashedPassword,
        role: 'admin'
      });
      console.log('Admin user seeded successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
}