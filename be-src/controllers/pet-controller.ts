import { Pet } from "../models/models";
import { algoliaPets } from "../lib/algolia";

async function createPet(dataPet, user_id) {
  const { fullname, imgURL, lost_geo_lat, lost_geo_lng } = dataPet;
  const newPet = await Pet.create({
    fullname,
    imgURL,
    lost_geo_lat: parseFloat(lost_geo_lat),
    lost_geo_lng: parseFloat(lost_geo_lng),
    found_it: false,
    userId: user_id,
  });
  const pet_id = await newPet.get("id");
  const newPetAlgolia = algoliaPets.saveObject({
    objectID: pet_id,
    _geoloc: {
      lost_geo_lat,
      lost_geo_lng,
    },
  });
  return pet_id;
}

export { createPet };
