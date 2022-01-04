import { User } from "../models/models";
import { sequelize } from "../models/conn";

async function createUser(dataUser) {
  const newUser = await User.create({
    fullname: dataUser.fullname,
    email: dataUser.email,
  });
  const newUserId = newUser.get("id");
  return newUserId;
}

async function updateUser(user_id: number, updatedData) {
  const existUser = await User.findByPk(user_id);
  if (updatedData.pet_id) {
    await existUser.update({
      pet_id: sequelize.fn(
        "array_append",
        sequelize.col("pet_id"),
        updatedData.pet_id
      ),
    });
  }
  if (updatedData.fullname) {
    console.log("controller", updatedData);
    await existUser.update({
      fullname: updatedData.fullname,
    });
  }
  return true;
}

export { createUser, updateUser };
