import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

//Los modelos siempre deben nombrar en singular
export class Pet extends Model {}
Pet.init(
  {
    fullname: DataTypes.STRING,
    imgURUL: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    found_it: DataTypes.BOOLEAN,
  },
  { sequelize, modelName: "pet" }
);
