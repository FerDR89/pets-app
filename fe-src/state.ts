// const API_URL = "https://dwf-m7.herokuapp.com";
const API_URL = "http://localhost:3000";

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
      //Array con la info de todas las pets cercanas para mostrar al invitado
      petsAround: [
        // {
        //   petName: "",
        //   petImgURL: "",
        //   petLoc: {
        //     lng: "",
        //     lat: "",
        //   },
        //   found_it: "",
        // },
      ],
    },

    //Objeto con la info de 1 mascota
    pet: {
      petName: "",
      petImgURL: "",
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

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    // localStorage.setItem("localData", JSON.stringify(newState));
    console.log("State", this.data);
  },

  setUserEmail(email: string) {
    const cs = this.getState();
    cs.user.userEmail = email;
    this.setState(cs);
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

  setUserId(userId: number) {
    const cs = this.getState();
    cs.user.userId = userId;
    this.setState(cs);
  },

  setUserToken(userToken: string) {
    const cs = this.getState();
    cs.user.userToken = userToken;
    this.setState(cs);
  },

  setUserRoute(route: string) {
    const cs = this.getState();
    cs.user.userRoute = route;
    this.setState(cs);
  },

  // setUserName(name: string) {
  //   const cs = this.getState();
  //   cs.userName = name;
  //   this.setState(cs);
  // },

  setGuessLoc(lng: number, lat: number) {
    const cs = this.getState();
    cs.guess.guessLoc.lng = lng;
    cs.guess.guessLoc.lat = lat;
    this.setState(cs);
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
    const dataUser = {
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
      body: JSON.stringify(dataUser),
    });
  },

  subscribe(callback) {
    this.listeners.push(callback);
    console.log("soy el subscribe");
  },
};

export { state };
