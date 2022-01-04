import { Auth } from "../models/models";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
require("dotenv").config();

const SECRET = process.env.SECRET_KEY;

async function getUserId(email) {
  const user = await Auth.findOne({
    where: { email },
  });
  if (user == null) {
    const user_id = 0;
    return user_id;
  } else {
    const user_id = user.get("id");
    return user_id;
  }
}

function getHash(text: string) {
  return crypto.createHash("sha1").update(text).digest("hex");
}

async function createAuthUser(dataUser, userId) {
  const { email, password } = dataUser;

  const newUserAuth = await Auth.create({
    email,
    password: getHash(password),
    user_id: userId,
  });
  return true;
}

async function authUser(dataUser) {
  const { email, password } = dataUser;
  const passHash = getHash(password);
  const auth = await Auth.findOne({
    where: { email, password: passHash },
  });
  if (auth == null) {
    return false;
  } else {
    const token = jwt.sign({ user_id: auth.get("user_id") }, SECRET);
    return token;
  }
}

async function updateAuthUser(user_id: number, password?) {
  const existAuthUser = await Auth.findByPk(user_id);
  const passHash = getHash(password);
  await existAuthUser.update({
    password: passHash,
  });
  return true;
}

export { createAuthUser, getUserId, authUser, updateAuthUser };
