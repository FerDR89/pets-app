import { Pet } from "../models/models";
import { algoliaPets } from "../lib/algolia";
import { cloudinary, cloudinaryOptions } from "../lib/cloudinary";

async function uploadPetImg(img: string) {
  return cloudinary.uploader.upload(img, cloudinaryOptions);
}

async function createPet(dataPet, user_id) {
  const { fullname, imgURL, lost_geo_lat, lost_geo_lng } = dataPet;
  //Cuando termine el front, descomentar y probar que funcione Cloudinary
  // const img = await uploadPetImg(imgURL);
  const newPet = await Pet.create({
    fullname,
    //Cuando termine el front, descomentar y probar que funcione Cloudinary
    // imgURL: img.secure_url,
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
      lat: lost_geo_lat,
      lng: lost_geo_lng,
    },
  });
  return pet_id;
}

async function getMyPets(user_id) {
  console.log("getMyPets", user_id);

  if (!user_id) {
    return false;
  } else {
    const userPets = await Pet.findAll({
      where: {
        userId: user_id,
      },
    });
    return userPets;
  }
}

async function updatePet(dataPet, pet_id) {
  const { fullname, imgURL, lost_geo_lat, lost_geo_lng, found_it } = dataPet;
  //Cuando termine el front, descomentar y probar que funcione Cloudinary
  // const img = await uploadPetImg(imgURL);
  await Pet.update(
    {
      ...dataPet,
    },
    {
      where: {
        id: pet_id,
      },
    }
  );

  if (lost_geo_lat && lost_geo_lng) {
    algoliaPets.partialUpdateObject({
      objectID: pet_id,
      _geoloc: {
        lat: lost_geo_lat,
        lng: lost_geo_lng,
      },
    });
  }
  return true;
}

async function deletePet(pet_id: number) {
  const deletedPet = await Pet.destroy({
    where: {
      id: pet_id,
    },
  });
  algoliaPets.deleteObject(pet_id.toString());
  return deletePet;
}

async function searchPet(pet_id: number) {
  const foundPet = await Pet.findByPk(pet_id);
  const objectPet = {
    user_id: foundPet.get("userId"),
    petName: foundPet.get("fullname"),
  };
  return objectPet;
}

//SEGUIR UNA VEZ QUE PUEDA SUBIR/MODIFICAR MASCOTAS DESDE EL FRONT
async function searchPetsAround(lat, lng) {}

export { createPet, getMyPets, updatePet, deletePet, searchPet };
