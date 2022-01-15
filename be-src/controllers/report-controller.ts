import { Report } from "../models/models";
import { sequelize } from "../models/conn";

function reportPet(guessData, pet_id) {
  const createdReport = Report.create({
    fullname: guessData.guessName,
    phone: parseInt(guessData.guessPhone),
    report: guessData.guessReportPet,
    petId: parseInt(pet_id),
  });
  return true;
}

export { reportPet };
