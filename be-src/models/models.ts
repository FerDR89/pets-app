import { Auth } from "./auth";
import { Pet } from "./pet";
import { Report } from "./report";
import { User } from "./user";

User.hasMany(Pet);
Pet.belongsTo(User);

Pet.hasMany(Report);
Report.belongsTo(Pet);

export { User, Pet, Auth, Report };
