import { User } from "../models/models";

async function createUser(dataUser) {
  const newUser = await User.create({
    fullname: dataUser.fullname,
    email: dataUser.email,
  });
  const newUserId = newUser.get("id");
  return newUserId;
}

export { createUser };
