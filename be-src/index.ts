import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import * as jwt from "jsonwebtoken";
import { sgMail } from "./lib/sengrid";
require("dotenv").config();
const SECRET = process.env.SECRET_KEY;
import { algoliaPets, algoliaUsers } from "./lib/algolia";
import {
  createUser,
  searchUser,
  updateUser,
} from "./controllers/user-controller";
import { reportPet } from "./controllers/report-controller";
import * as authFunc from "./controllers/auth-controller";
import * as petFunc from "./controllers/pet-controller";
import { Auth, User, Pet, Report } from "./models/models";

const app = express();
const port = process.env.PORT || 3000;

const allowedHosts = [
  "https://petrescuereact.web.app",
  "http://127.0.0.1:8080",
];

app.use(
  cors({
    origin: allowedHosts,
  })
);

//Mediante la opción limit, extiendo el peso máximo soportado para recibir un archivo.
app.use(express.json({ limit: "50mb" }));

app.post("/signin", async (req, res) => {
  if (!req.body.email) {
    res.status(400).json({ message: "Please insert a valid email" });
  } else {
    try {
      const user_id = await authFunc.getUserId(req.body.email);
      if (user_id === 0) {
        res.json({ message: "user not found" });
      } else {
        const { userName } = await searchUser(user_id);
        res.json({ user_id, userName });
      }
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
      const newUserAuth = await authFunc.createAuthUser(req.body, newUserId);
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
      console.log(req.body);

      const auth = await authFunc.authUser(req.body);
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

/*Cuando envio los datos desde el front, lo tengo que hacer junto al header authorization y el token */
app.patch("/my-profile", authMiddleware, async (req, res) => {
  const { user_id } = req._userData;
  if (!req.body) {
    res.status(401).json({ message: "your information is not complete" });
  } else {
    const { fullname, password } = req.body;
    try {
      let updatedData = { fullname };
      if (fullname && password) {
        const existUser = await updateUser(user_id, updatedData);
        const existAuthUser = await authFunc.updateAuthUser(user_id, password);
        res.json({
          updateUser: true,
          updateAuth: true,
        });
      }
      if (fullname) {
        const existUser = await updateUser(user_id, updatedData);
        res.json({
          updateUser: true,
        });
      }

      if (password) {
        const existAuthUser = await authFunc.updateAuthUser(user_id, password);
        console.log("Dentro del 3er if");
        console.log(password);
        res.json({
          updateAuth: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
});

/*Cuando envio los datos desde el front, lo tengo que hacer junto al header authorization y el token */
app.post("/post-pet", authMiddleware, async (req, res) => {
  const { user_id } = req._userData;
  if (!req.body && !user_id) {
    res.status(401).json({ message: "your information is not complete" });
  } else {
    try {
      const pet_id = await petFunc.createPet(req.body, user_id);
      let updatedData = { pet_id };
      const existUser = await updateUser(user_id, updatedData);
      if (pet_id && existUser === true) {
        res.json({
          newPet: true,
          updateUser: true,
        });
      } else {
        res.status(501).json({
          message: "error server",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
});

app.get("/get-my-pets", authMiddleware, async (req, res) => {
  const { user_id } = req._userData;
  if (!req.body) {
    res.status(401).json({ message: "your information is not complete" });
  } else {
    try {
      const userPets = await petFunc.getMyPets(user_id);
      res.send(userPets);
    } catch (error) {
      console.error(error);
    }
  }
});

function checkDataPet(body) {
  const respuesta: any = {};
  if (body.fullname) {
    respuesta.fullname = body.fullname;
  }
  if (body.imgURL) {
    respuesta.imgURL = body.imgURL;
  }
  if (body.place_lost) {
    respuesta.place_lost = body.place_lost;
  }
  if (body.lost_geo_lat) {
    respuesta.lost_geo_lat = body.lost_geo_lat;
  }
  if (body.lost_geo_lng) {
    respuesta.lost_geo_lng = body.lost_geo_lng;
  }
  if (body.found_it) {
    respuesta.found_it = body.found_it;
  }
  return respuesta;
}

/*Desde el front cuando hago click en editar la mascota, de alguna manera tengo que conseguir su id y pasarlo en el body*/
app.patch("/update-pet", authMiddleware, async (req, res) => {
  if (!req.body) {
    res.status(401).json({ message: "your information is not complete" });
  } else {
    const { pet_id } = req.body;
    const dataPet = await checkDataPet(req.body);
    try {
      const updatedPet = await petFunc.updatePet(dataPet, pet_id);
      if (updatedPet === true) {
        res.json({
          updatePet: true,
        });
      } else {
        res.status(501).json({
          message: "error server",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
});

app.delete("/delete-pet/:petId", authMiddleware, async (req, res) => {
  if (!req.body) {
    res.status(401).json({ message: "your information is not complete" });
  } else {
    const pet_id = req.params.petId;
    console.log("Express", pet_id);

    try {
      const deletedPet = await petFunc.deletePet(pet_id);
      if (deletedPet == true) {
        res.json({
          deletedPet: true,
        });
      } else {
        res.status(501).json({
          message: "error server",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
});

app.get("/pets-around", async (req, res) => {
  const { lat, lng } = req.query;
  const queryResult = await petFunc.searchPetsAround(lat, lng);
  res.json(queryResult);
});

app.post("/report-pet", async (req, res) => {
  const { pet_id } = req.body;
  if (!req.body) {
    res.status(401).json({ message: "your information is not complete" });
  } else {
    try {
      const report = await reportPet(req.body, pet_id);
      if (report == true) {
        const foundPet = (await petFunc.searchPet(pet_id)) as any;
        const user_id = foundPet.userId;
        const petName = foundPet.fullname;
        const { userEmail } = await searchUser(user_id);
        //VER DE EXTRAER ESTO EN UNA FUNCIÓN
        const msg = {
          to: userEmail,
          from: "ferdr89dev@gmail.com",
          subject: `Creemos que encontramos a ${petName}, por favor ponte en contacto con quien lo vio`,
          text: `Nombre: ${req.body.guessName},phone: ${parseInt(
            req.body.guessPhone
          )},report: ${req.body.guessReportPet}`,
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });
        res.json({ reported: true });
      } else {
        res.status(501).json({
          message: "error server",
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
  // const ruta = path.resolve(__dirname, "../dist/index.html");
  res.sendFile(ruta);
});

app.listen(port, () => {
  console.log("La app esta corriendo en:", port);
});
