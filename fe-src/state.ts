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

    //Objeto con la info de 1 mascota
    pet: {
      petName: "",
      petImgURL: "",
      petPlaceLost: "",
      petLoc: {
        lng: "",
        lat: "",
      },
      found_it: "",
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

  setGuessReportPetId(pet_id: number) {
    const cs = this.getState();
    cs.guess.guessReportPetId = pet_id;
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
};

export { state };
