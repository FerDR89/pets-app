import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

//Los modelos siempre deben nombrar en singular
export class User extends Model {}
User.init(
  {
    email: DataTypes.STRING,
    fullname: DataTypes.STRING,
    pet_id: DataTypes.ARRAY(DataTypes.INTEGER),
  },
  { sequelize, modelName: "user" }
);
