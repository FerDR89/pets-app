const API_URL = process.env.API_BASE_URL || "http://localhost:3000";

const state = {
  data: {
    userName: "",
    userId: "",
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

  subscribe(callback) {
    this.listeners.push(callback);
  },
};

export { state };
