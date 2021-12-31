import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

//Los modelos siempre deben nombrar en singular
export class Pet extends Model {}
Pet.init(
  {
    fullname: DataTypes.STRING,
    imgURL: DataTypes.STRING,
    lost_geo_lat: DataTypes.FLOAT,
    lost_geo_lng: DataTypes.FLOAT,
    found_it: DataTypes.BOOLEAN,
  },
  { sequelize, modelName: "pet" }
);
