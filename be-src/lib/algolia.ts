import algoliasearch from "algoliasearch";
require("dotenv").config();

//Incializa la app y la guarda en una referencia. Como primer parámetro es el nombre de la app y como
//segundo parámetro se pasa la admin key
const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);

//Inicializa y guarda en una referencia el índice sobre el cual queremos trabajar.
const algoliaPets = client.initIndex("pets");
const algoliaUsers = client.initIndex("users");

export { algoliaPets, algoliaUsers };
