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

/*Cuando los parámetros vienen de un body, como TS no sabe que tipo de datos trae adentro el body
lo tomo como any*/

async function updateUser(user_id, updatedData) {
  if (updatedData.pet_id) {
    await User.update(
      {
        pet_id: sequelize.fn(
          "array_append",
          sequelize.col("pet_id"),
          updatedData.pet_id
        ),
      },
      { where: { id: user_id } }
    );
  }
  if (updatedData.fullname) {
    await User.update(
      {
        fullname: updatedData.fullname,
      },
      { where: { id: user_id } }
    );
  }
  return true;
}

export { createUser, updateUser };
