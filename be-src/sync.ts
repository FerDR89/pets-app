import { sequelize } from "./models/conn";
import { User } from "./models/user";

/*Una opción para sincronizar la DB es: 
Importar un modelo y a travez de ese modelo mediante la prop sequelize realizar la sync*/

User.sequelize.sync({ alter: true }).then((res) => {
  console.log(res);
});
