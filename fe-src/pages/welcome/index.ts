import { Router } from "@vaadin/router";
import { state } from "../../state";
class WelcomePage extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  listeners() {
    const btn = this.shadow.querySelector(".welcome__btn");
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      function success(position) {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        state.setGuessLoc(lng, lat);
        Router.go("/pets-around");
      }

      const error = (error) => {
        alert("Unable to retrieve your location");
        console.log("Unable to retrieve your location");
      };

      const optionsPosition = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(success, error, optionsPosition);
    });
  }

  render() {
    const sectionEl = document.createElement("section");
    sectionEl.className = "welcome";
    sectionEl.innerHTML = `
    <div class="welcome__container">
      <custom-header></custom-header>
      <div class="welcome__container-title">
        <custom-text tag="h1" size="40px">Mascotas perdidas cerca tuyo</custom-text>
       </div>
      <div class="welcome__container-text">
          <custom-text tag="h3" size="16px">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</custom-text>
       </div>

      <div class="welcome__container-btn">
          <button class="welcome__btn">Dar mi ubicación </button>
      </div>
   
  
  </div>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
    .welcome__container{
        box-sizing: border-box;
        max-width:100%;
        height:100vh;
        padding: 0 20px;
        display:flex;
        flex-direction:column;
        align-items:center;
    }
    @media(min-width:376px){
      .welcome__container{
        width:100%;
        height:100vh;
        padding:0px;
    }}

    .welcome__container-title{
      width:100%;
      padding-top:20px;
      padding-bottom: 50px;
    }

    .welcome__container-text{
      padding-bottom:22px;
    }

    .welcome__container-btn{
        width:100%;
        height:50px;
        border:none;
        border-radius:2px;
      }
      
      .welcome__btn{
        min-width:100%;
        min-height:100%;
        background-color: var(--btn-bg1);
        border:none;
        border-radius:2px;
        font-size:16px;
        font-weight:700;
    }

    `;
    this.shadow.appendChild(sectionEl);
    this.shadow.appendChild(style);
    this.listeners();
  }
}
window.customElements.define("x-welcome-page", WelcomePage);
