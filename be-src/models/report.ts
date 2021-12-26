import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

//Los modelos siempre deben nombrar en singular
export class Report extends Model {}
Report.init(
  {
    fullname: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    report: DataTypes.STRING,
    pet_id: DataTypes.INTEGER,
  },
  { sequelize, modelName: "report" }
);
