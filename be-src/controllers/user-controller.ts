import { User } from "../models/models";

async function createUser(dataUser) {
  const newUser = await User.create({
    fullname: dataUser.fullname,
    email: dataUser.email,
  });
  const newUserId = newUser.get("id");
  return newUserId;
}

async function updateUser(user_id: number, pet_id?, fullname?) {
  const existUser = await User.findByPk(user_id);
  await existUser.update({
    fullname,
    pet_id,
  });
  return true;
}

export { createUser, updateUser };
