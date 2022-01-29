import { Router } from "@vaadin/router";
import { state } from "../../state";
class MyPetsPage extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    state.getMyPets(() => {
      this.render();
    });
  }
  listeners() {
    const cardsEl = this.shadow.querySelectorAll("custom-card");
    for (const card of cardsEl) {
      card.addEventListener("report", (e) => {
        const event = e as any;
        const petId = event.detail.petId;
        state.getMyPet(petId, () => {
          Router.go("/edit-pet");
        });
      });
    }
  }

  selectDataRender() {
    const cs = state.getState();
    const userPetsCol = cs.user.pets;
    if (userPetsCol.length > 0) {
      const containerCardEl = this.shadow.querySelector(
        ".my-pets__container-card"
      );
      containerCardEl.innerHTML = `
      ${userPetsCol.map(
        (pet) =>
          `<custom-card petId="${pet.id}" petImg="${pet.imgURL}" petName="${pet.fullname}" petLoc="${pet.place_lost}"></custom-card>`
      )}  
      `;
    } else {
      const containerTitleEl = this.shadow.querySelector(
        ".my-pets__container-title"
      );
      containerTitleEl.innerHTML = `
      <custom-text tag="h1" size="40px">Aun no reportaste mascotas perdidas</custom-text>
      `;
    }
  }

  render() {
    const sectionEl = document.createElement("section");
    sectionEl.className = "my-pets";
    sectionEl.innerHTML = `
    <div class="my-pets__container">
      <custom-header></custom-header>
      <div class="my-pets__container-title">
        <custom-text tag="h1" size="40px">Mis mascotas reportadas</custom-text>
      </div>
      <div class="my-pets__container-card">  
      </div>
    </div>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
    .my-pets__container{
        box-sizing: border-box;
        max-width:100%;
        min-height:100vh;
        padding: 0 20px;
        display:flex;
        flex-direction:column;
        align-items:center;
        position:relative;
    }

    .my-pets__modal-active{
      opacity:0.45;
    }

    @media(min-width:376px){
      .my-pets__container{
        width:100%;
        min-height:100vh;
        padding:0px;
    }}

    .my-pets__container-title{
      width:100%;
      padding-top:20px;
      padding-bottom: 50px;
    }

    .my-pets__container-text{
      padding-bottom:22px;
    }

    .my-pets__container-btn{
        width:100%;
        height:50px;
        border:none;
        border-radius:5px;
      }
      
    .my-pets__btn{
      min-width:100%;
      min-height:100%;
      background-color: var(--btn-bg1);
      border:none;
      border-radius:5px;
      font-size:16px;
      font-weight:700;
      cursor:pointer;
    }    `;
    this.shadow.appendChild(sectionEl);
    this.shadow.appendChild(style);
    this.selectDataRender();
    this.listeners();
  }
}
customElements.define("x-my-pets-page", MyPetsPage);
