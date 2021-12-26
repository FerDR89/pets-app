import { Auth } from "./auth";
import { Pet } from "./pet";
import { User } from "./user";

User.hasMany(Pet);
Pet.belongsTo(User);

export { User, Pet, Auth };
