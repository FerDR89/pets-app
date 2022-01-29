const API_URL = "https://dwf-m7.herokuapp.com";
// const API_URL = "http://localhost:3000";

const state = {
  data: {
    user: {
      userName: "",
      userEmail: "",
      userId: "",
      userToken: "",
      pets: [],
      userRoute: "",
    },
    guess: {
      guessLoc: {
        lng: "",
        lat: "",
      },
      guessName: "",
      guessPhone: "",
      guessReportPet: "",
      guessReportPetId: "",
      petsAround: [],
    },
    pet: {
      petName: "",
      petImgURL: "",
      petPlaceLost: "",
      petLoc: {
        lng: "",
        lat: "",
      },
      found_it: "",
      petId: "",
    },
  },
  listeners: [],

  getState() {
    return this.data;
  },

  getUserId() {
    const cs = this.getState();
    const email = cs.user.userEmail;
    return fetch(API_URL + "/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((result) => result);
  },

  getUserToken(password: string) {
    const cs = this.getState();
    const email = cs.user.userEmail;
    return fetch(API_URL + "/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((result) => result);
  },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    // localStorage.setItem("localData", JSON.stringify(newState));
    console.log("State", this.data);
  },

  setUserId(userId: number) {
    const cs = this.getState();
    cs.user.userId = userId;
    this.setState(cs);
  },

  setUserEmail(email: string) {
    const cs = this.getState();
    cs.user.userEmail = email;
    this.setState(cs);
  },

  setUserName(name: string) {
    const cs = this.getState();
    cs.user.userName = name;
    this.setState(cs);
  },

  setUserRoute(route: string) {
    const cs = this.getState();
    cs.user.userRoute = route;
    this.setState(cs);
  },

  setUserToken(userToken: string) {
    const cs = this.getState();
    cs.user.userToken = userToken;
    this.setState(cs);
  },

  setUserData(password) {
    const cs = this.getState();
    const userData = {
      fullname: cs.user.userName,
      email: cs.user.userEmail,
      password: password,
    };
    fetch(API_URL + "/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  },

  updateUserData(callback, password?) {
    const cs = this.getState();
    const fullname = cs.user.userName;
    const userToken = cs.user.userToken;
    const userData = {
      fullname,
      password: password,
    };
    fetch(API_URL + "/my-profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + userToken,
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((result) => callback(result));
  },

  setPetName(name: string) {
    const cs = this.getState();
    cs.pet.petName = name;
    this.setState(cs);
  },

  setPetPlaceLost(place: string) {
    const cs = this.getState();
    cs.pet.petPlaceLost = place;
    this.setState(cs);
  },

  setPetStatus(found_it: boolean) {
    const cs = this.getState();
    cs.pet.found_it = found_it;
    this.setState(cs);
  },

  createPet(callback) {
    const cs = this.getState();
    const userToken = cs.user.userToken;
    const petData = {
      fullname: cs.pet.petName,
      imgURL: cs.pet.petImgURL,
      lost_geo_lat: cs.pet.petLoc.lat,
      lost_geo_lng: cs.pet.petLoc.lng,
      place_lost: cs.pet.petPlaceLost,
      found_it: false,
    };
    fetch(API_URL + "/post-pet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + userToken,
      },
      body: JSON.stringify(petData),
    })
      .then((res) => res.json())
      .then((result) => callback(result));
  },

  setGuessLoc(lng: number, lat: number) {
    const cs = this.getState();
    cs.guess.guessLoc.lng = lng;
    cs.guess.guessLoc.lat = lat;
    this.setState(cs);
  },

  getPetsAround(callback) {
    const cs = this.getState();
    const lat = cs.guess.guessLoc.lat;
    const lng = cs.guess.guessLoc.lng;
    fetch(API_URL + "/pets-around?lat=" + lat + "&lng=" + lng)
      .then((res) => res.json())
      .then((result) => {
        cs.guess.petsAround = result;
        this.setState(cs);
        callback();
      });
  },

  getMyPet(petId: number, callback) {
    const cs = this.getState();
    const userPets = cs.user.pets;
    const petFounded = userPets.find((pet) => pet.id == petId);
    if (petFounded) {
      cs.pet.petName = petFounded.fullname;
      cs.pet.petImgURL = petFounded.imgURL;
      cs.pet.petPlaceLost = petFounded.place_lost;
      cs.pet.found_it = petFounded.found_it;
      cs.pet.petLoc.lat = petFounded.lost_geo_lat;
      cs.pet.petLoc.lng = petFounded.lost_geo_lng;
      cs.pet.petId = petFounded.id;
      this.setState(cs);
      callback();
    } else {
      console.error("Hubo un error, no se pudo encontrar su mascota");
      callback();
    }
  },

  getMyPets(callback) {
    const cs = this.getState();
    const userToken = cs.user.userToken;
    fetch(API_URL + "/get-my-pets", {
      method: "GET",
      headers: {
        Authorization: "bearer " + userToken,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        cs.user.pets = result;
        this.setState(cs);
        callback();
      });
  },

  updatePet(callback) {
    const cs = this.getState();
    const userToken = cs.user.userToken;

    const petData = {} as any;
    if (cs.pet.petName) {
      petData.fullname = cs.pet.petName;
    }
    if (cs.pet.petImgURL) {
      petData.imgURL = cs.pet.petImgURL;
    }
    if (cs.pet.petLoc.lat) {
      petData.lost_geo_lat = cs.pet.petLoc.lat;
    }
    if (cs.pet.petLoc.lng) {
      petData.lost_geo_lng = cs.pet.petLoc.lng;
    }
    if (cs.pet.petPlaceLost) {
      petData.place_lost = cs.pet.petPlaceLost;
    }
    if (cs.pet.found_it) {
      petData.found_it = cs.pet.found_it;
    }
    if (cs.pet.petId) {
      petData.pet_id = cs.pet.petId;
    }

    fetch(API_URL + "/update-pet", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + userToken,
      },
      body: JSON.stringify(petData),
    })
      .then((res) => res.json())
      .then((result) => callback(result));
  },

  deletePet(callback) {
    const cs = this.getState();
    const userToken = cs.user.userToken;
    const pet_id = cs.pet.petId;
    fetch(API_URL + "/delete-pet/" + pet_id, {
      method: "DELETE",
      headers: {
        Authorization: "bearer " + userToken,
      },
    })
      .then((res) => res.json())
      .then((result) => callback(result));
  },

  setGuessReportPetId(petId: number) {
    const cs = this.getState();
    cs.guess.guessReportPetId = petId;
    this.setState(cs);
  },

  setGuessData(dataGuess: object) {
    const cs = this.getState();
    cs.guess = {
      ...cs.guess,
      ...dataGuess,
    };
    this.setState(cs);
  },

  sendReport() {
    const cs = this.getState();
    const userData = {
      guessName: cs.guess.guessName,
      guessPhone: cs.guess.guessPhone,
      guessReportPet: cs.guess.guessReportPet,
      pet_id: cs.guess.guessReportPetId,
    };
    fetch(API_URL + "/report-pet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  },

  subscribe(callback) {
    this.listeners.push(callback);
    console.log("soy el subscribe");
  },
  resetState(callback) {
    const cs = this.getState();
    cs.user.userName = "";
    cs.user.userEmail = "";
    cs.user.userToken = "";
    cs.user.userId = "";
    state.setState(cs);
    callback();
  },
};

export { state };
