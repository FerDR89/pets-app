require("dotenv").config();
const API_URL = process.env.API_BASE_URL || "http://localhost:3000";

const state = {
  data: {
    user: {
      userName: "",
      userEmail: "",
      userId: "",
      userToken: "",
      pets_id: [],
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
    },
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

  subscribe(callback) {
    this.listeners.push(callback);
  },
};

export { state };
