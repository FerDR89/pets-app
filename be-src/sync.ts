import { sequelize } from "./models/conn";
import { User } from "./models/models";

/*Una opción para sincronizar la DB es: 
Importar un modelo y a travez de ese modelo mediante la prop sequelize realizar la sync*/

User.sequelize
  .sync({ force: true })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => console.log(err));
