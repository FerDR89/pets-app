import { Pet } from "../models/models";
import { algoliaPets } from "../lib/algolia";
import { cloudinary, cloudinaryOptions } from "../lib/cloudinary";
import { Where } from "sequelize/dist/lib/utils";
import { where } from "sequelize/dist";

async function uploadPetImg(img: string) {
  return cloudinary.uploader.upload(img, cloudinaryOptions);
}

async function createPet(dataPet, user_id) {
  const { fullname, imgURL, lost_geo_lat, lost_geo_lng, place_lost } = dataPet;
  const img = await uploadPetImg(imgURL);
  const newPet = await Pet.create({
    fullname,
    imgURL: img.secure_url,
    lost_geo_lat: parseFloat(lost_geo_lat),
    lost_geo_lng: parseFloat(lost_geo_lng),
    place_lost,
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
  const { fullname, imgURL, lost_geo_lat, lost_geo_lng, found_it, place_lost } =
    dataPet;

  const objectData = {};

  if (imgURL) {
    const img = await uploadPetImg(imgURL);
    objectData["imgURL"] = img.secure_url;
  }
  if (fullname) {
    objectData["fullname"] = fullname;
  }

  if (lost_geo_lat && lost_geo_lng) {
    objectData["lost_geo_lat"] = parseFloat(lost_geo_lat);
    objectData["lost_geo_lng"] = parseFloat(lost_geo_lng);
  }

  if (place_lost) {
    objectData["place_lost"] = place_lost;
  }

  if (found_it) {
    objectData["found_it"] = found_it;
  }

  await Pet.update(objectData, {
    where: {
      id: pet_id,
    },
  });

  // await Pet.update(
  //   {
  //     fullname,
  //     imgURL: img.secure_url,
  //     lost_geo_lat: parseFloat(lost_geo_lat),
  //     lost_geo_lng: parseFloat(lost_geo_lng),
  //     place_lost,
  //     found_it,
  //   },
  //   {
  //     where: {
  //       id: pet_id,
  //     },
  //   }
  // );

  if (lost_geo_lat && lost_geo_lng) {
    algoliaPets.partialUpdateObject({
      objectID: pet_id,
      _geoloc: {
        lat: lost_geo_lat,
        lng: lost_geo_lng,
      },
    });
  }

  // algoliaPets.partialUpdateObject({
  //   objectID: pet_id,
  //   _geoloc: {
  //     lat: lost_geo_lat,
  //     lng: lost_geo_lng,
  //   },
  // });

  console.log(Pet);

  return true;
}

async function deletePet(pet_id: number) {
  const deletedPet = await Pet.destroy({
    where: {
      id: pet_id,
    },
  });
  algoliaPets.deleteObject(pet_id.toString());

  console.log(deletePet);

  return true;
}

async function searchPet(pet_id: number) {
  const foundPet = await Pet.findByPk(pet_id);
  return foundPet;
}

async function searchPetsAround(lat, lng) {
  const petsIdCol = [];
  const result = await algoliaPets.search("", {
    aroundLatLng: `${lat} , ${lng}`,
    aroundRadius: 100000,
  });

  for (const pet of result.hits) {
    petsIdCol.push(pet.objectID);
  }

  const petsAround = await Pet.findAll({
    where: {
      id: petsIdCol,
    },
    attributes: ["id", "fullname", "imgURL", "place_lost", "found_it"],
  });

  return petsAround;
}

export {
  createPet,
  getMyPets,
  updatePet,
  deletePet,
  searchPet,
  searchPetsAround,
};
