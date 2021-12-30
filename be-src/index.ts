import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import { cloudinary } from "./lib/cloudinary";
import { algoliaPets, algoliaUsers } from "./lib/algolia";
import { createUser } from "./controllers/user-controller";
import {
  getUserId,
  createAuthUser,
  authUser,
} from "./controllers/auth-controller";

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
      console.log("email on sigin", req.body.email);
      const user_id = await getUserId(req.body.email);
      console.log("User on sigin", user_id);
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
      if (req.body.password === req.body.repeatPassword) {
        const newUserId = await createUser(req.body);
        const newUserAuth = await createAuthUser(req.body, newUserId);
        newUserAuth == true
          ? res.json({ newUserId })
          : res.status(500).json({
              message: "Server error",
            });
      } else {
        res.status(400).json({
          message: "Please check your passwords. They are not the same",
        });
      }
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
