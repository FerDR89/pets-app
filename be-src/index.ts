import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import * as jwt from "jsonwebtoken";
require("dotenv").config();
const SECRET = process.env.SECRET_KEY;
import { cloudinary } from "./lib/cloudinary";
import { algoliaPets, algoliaUsers } from "./lib/algolia";
import { createUser, updateUser } from "./controllers/user-controller";
import {
  getUserId,
  createAuthUser,
  authUser,
} from "./controllers/auth-controller";
import { createPet } from "./controllers/pet-controller";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

//Mediante la opción limit, extiendo el peso máximo soportado para recibir un archivo.
app.use(express.json({ limit: "50mb" }));

app.post("/signin", async (req, res) => {
  if (!req.body.email) {
    res.status(400).json({ message: "Please insert a valid email" });
  } else {
    try {
      const user_id = await getUserId(req.body.email);
      user_id === 0
        ? res.json({ message: "user not found" })
        : res.json({ user_id });
    } catch (error) {
      console.error(error);
    }
  }
});

/*Si llega el user a este endpoint es porque el user no existe en la DB
Guardar el email del usuario en el state para reutilizarlo en este
Cuando mando la info desde el state, asegurarme de parsearla a un string*/
app.post("/auth", async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: "Please insert an email" });
  } else {
    try {
      const newUserId = await createUser(req.body);
      const newUserAuth = await createAuthUser(req.body, newUserId);
      newUserAuth == true
        ? res.json({ newUserId })
        : res.status(500).json({
            message: "Server error",
          });
    } catch (error) {
      console.error(error);
    }
  }
});

/*Si llega el user a este endpoint es porque el user existe en la DB o fue creado en el paso anterior*/
app.post("/auth/token", async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: "Please insert your password" });
  } else {
    try {
      const auth = await authUser(req.body);
      auth == false
        ? res.status(400).json({ message: "Invalid password" })
        : res.json({ token: auth });
    } catch (error) {
      console.error(error);
    }
  }
});

function authMiddleware(req, res, next) {
  /*req.header es donde me llegan los header en un request.
  Este objeto tendrá como propieda "Authorization" que dentro tiene como valor la palabra "bearer" y a continuación
  el token que enviamos a traves del header.
  Mediante el método split(" ") dividimos el string en un array indicandole a traves de un espacio entre las comillas que cada vez que encuentre un espacio vacio me genere una nueva posición del array quedandome así un array con dos posiciones. La primera la palabra bearer y luego el token*/
  const token = req.headers.authorization.split(" ")[1];

  try {
    const data = jwt.verify(token, SECRET);
    req._userData = data;
    next();
  } catch {
    res.status(401).json({ message: "your token is not correct" });
  }
}

app.post("/post-pet", authMiddleware, async (req, res) => {
  const { user_id } = req._userData;
  if (!req.body && !user_id) {
    res.status(401).json({ message: "your information is not complete" });
  } else {
    try {
      const pet_id = await createPet(req.body, user_id);
      const existUser = await updateUser(user_id, pet_id);
      if (pet_id && existUser === true) {
        res.json({
          newPet: true,
          updateUser: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
});

//Mediante este handler le indico que cualquier get que reciba y no encuentre en los endpoints anteriores
// lo redirija al front-end (cambiar path a fe-dist para cuando hacemos el deploy).
app.use(express.static(path.resolve(__dirname, "../fe-dist")));

// app.use(express.static(path.resolve(__dirname, "../dist")));

app.get("*", (req, res) => {
  const ruta = path.resolve(__dirname, "../fe-src/index.html");
  res.sendFile(ruta);
});

app.listen(port, () => {
  console.log("La app esta corriendo en:", port);
});
