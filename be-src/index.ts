import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import { cloudinary } from "./lib/cloudinary";
import { algoliaPets, algoliaUsers } from "./lib/algolia";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

//Mediante la opción limit, extiendo el peso máximo soportado para recibir un archivo.
app.use(express.json({ limit: "50mb" }));

app.get("/test", (req, res) => {
  res.json({ test: true });
});

console.log("HOLA MUNDO");

//Mediante este handler le indico que cualquier get que reciba y no encuentre en los endpoints anteriores
// lo redirija al front-end (cambiar path a fe-dist para cuando hacemos el deploy).
app.use(express.static(path.resolve(__dirname, "../dist")));

app.get("*", (req, res) => {
  const ruta = path.resolve(__dirname, "../fe-src/index.html");
  res.sendFile(ruta);
});

app.listen(port, () => {
  console.log("La app esta corriendo en:", port);
});
