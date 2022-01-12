import { Router } from "@vaadin/router";
import { state } from "../../state";
const perruna = require("../../assets/perruna.jpg");
const petPrueba = require("../../assets/pet-icon.png");
class PetsAroundPage extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }

  listeners() {
    const cardsEl = this.shadow.querySelectorAll("custom-card");
    for (const card of cardsEl) {
      const backgroundEl = this.shadow.querySelector(".pets-around__container");
      const modalEl = this.shadow.querySelector(".modal__container-modal");
      card.addEventListener("report", (e) => {
        const event = e as any;
        const guessReportPetId = event.detail.petId;
        backgroundEl.classList.toggle("pets-around__modal-active");
        modalEl.classList.toggle("modal__active");
        console.log("Click", guessReportPetId);
      });
    }

    const closeModalEl = this.shadow.querySelector(".modal__container-exit");
    const modalEl = this.shadow.querySelector(".modal__container-modal");
    const backgroundEl = this.shadow.querySelector(".pets-around__container");
    closeModalEl.addEventListener("click", () => {
      modalEl.classList.toggle("modal__active");
      backgroundEl.classList.toggle("pets-around__modal-active");
    });
  }

  render() {
    const sectionEl = document.createElement("section");
    sectionEl.className = "pets-around";
    sectionEl.innerHTML = `
    <div class="pets-around__container">
      <custom-header></custom-header>
      <div class="pets-around__container-title">
        <custom-text tag="h1" size="40px">Mascotas perdidas cerca tuyo</custom-text>
      </div>
      <div class="pets-around__container-card">
        <custom-card petId="1" petImg="${perruna}" petName="Pickachu" petLoc="San Martín"></custom-card>
        <custom-card petId="2" petImg="${perruna}" petName="Pickachu" petLoc="San Martín"></custom-card>
        <custom-card petId="3" petImg="${perruna}" petName="Pickachu" petLoc="San Martín"></custom-card>
        <custom-card petId="4" petImg="${perruna}" petName="Pickachu" petLoc="San Martín"></custom-card>
        <custom-card petId="5" petImg="${perruna}" petName="Pickachu" petLoc="San Martín"></custom-card>
      </div>
  </div>

  <div class="modal__container-modal">
  <div class="modal__container-exit">
    <div class="modal__exit-line1"></div>
    <div class="modal__exit-line2"></div>
  </div>
  <div class="modal__container-title">
      <custom-text tag="h1" size="40px">Reportar info de Pickachu</custom-text>
  </div>
  <form class="modal__form">
    <fieldset class="modal__fieldset">
      <label class="modal__label-name" for="name">TU NOMBRE</label>
      <input
        class="modal__input-name"
        id="name"
        name="name"
        type="text"
        required
      />
    </fieldset>

    <fieldset class="modal__fieldset">
      <label class="modal__label-phone" for="phone">TU TELÉFONO</label>
      <input
        class="modal__input-phone"
        id="phone"
        name="phone"
        type="tel"
        required
      />
    </fieldset>

    <fieldset class="modal__fieldset-area">
      <label class="modal__label-report" for="report"
        >¿DÓNDE LO VISTE?</label>
      <textarea
        name="report"
        id="report"
        class="modal__text-report"></textarea>
    </fieldset>

<div class="modal__container-btn">
  <button class="modal__form-btn">Enviar</button>
</div>
  </form>
</div>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
    .pets-around__container{
        box-sizing: border-box;
        max-width:100%;
        min-height:100vh;
        padding: 0 20px;
        display:flex;
        flex-direction:column;
        align-items:center;
        position:relative;
    }

    .pets-around__modal-active{
      opacity:0.45;
    }

    @media(min-width:376px){
      .pets-around__container{
        width:100%;
        min-height:100vh;
        padding:0px;
    }}

    .pets-around__container-title{
      width:100%;
      padding-top:20px;
      padding-bottom: 50px;
    }

    .pets-around__container-text{
      padding-bottom:22px;
    }

    .pets-around__container-btn{
        width:100%;
        height:50px;
        border:none;
        border-radius:2px;
      }
      
    .pets-around__btn{
      min-width:100%;
      min-height:100%;
      background-color: var(--btn-bg1);
      border:none;
      border-radius:2px;
      font-size:16px;
      font-weight:700;
    }

    /*--------------MODAL------------*/

    .modal__container-modal {
      box-sizing: border-box;
      width: 335px;
      height: 605px;
      padding: 0px 18px;
      display: none;
      flex-direction: column;
      border-radius:10px;
      border:none;
      background-color: rgba( 0, 0, 0, 0.75 );
      box-shadow: 0 8px 30px 0 rgba( 31, 38, 135, 0.37 );
      position:fixed;
      top:25px;
      left:20px;
      color:aliceblue;
    }

    .modal__active{
      display:flex;
    }

    .modal__container-exit {
      position: relative;
    }

    .modal__exit-line1, .modal__exit-line2 {
      width:20px;
      height:2px;
      border: 1px solid #000;
      background-color:lightcoral;
      transform: rotate(45deg);
      position: absolute;
      top: 20px;
      right: -8px;
    }

    .modal__exit-line2 {
      transform: rotate(-45deg);
    }

    .modal__container-title {
      padding:0;
      margin-top:30px;
      text-shadow: 3px 5px 1px lightcoral;
    }

    .modal__form {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
    }

    .modal__fieldset {
      box-sizing: border-box;
      width:100%;
      height: calc(25px + 50px + 2px);
      margin:0;
      padding:0;
      border:none;
    }

    .modal__fieldset-area {
      box-sizing: border-box;
      width:100%;
      height: calc(25px + 127px + 2px);
      margin:0;
      padding:0;
      border:none;
    }

    .modal__label-name, .modal__label-phone, .modal__label-report {
      display: block;
      font-weight: 500;
      margin-bottom:2px;
    }

    .modal__input-name , .modal__input-phone {
      box-sizing: border-box;
      width:100%;
      height:50px;
    }

    .modal__text-report {
      box-sizing: border-box;
      width:100%;
      height:127px;
    }

    .modal__container-btn {
      width: 100%;
      height: 50px;
      border: none;
      border-radius: 2px;
    }

    .modal__form-btn {
      min-width: 100%;
      min-height: 100%;
      background-color: var(--btn-bg1);
      border: none;
      border-radius: 2px;
      font-size: 16px;
      font-weight: 700;
      color: var(--font-colorWht)
    }

    `;
    this.shadow.appendChild(sectionEl);
    this.shadow.appendChild(style);
    this.listeners();
  }
}
window.customElements.define("x-pets-around-page", PetsAroundPage);
