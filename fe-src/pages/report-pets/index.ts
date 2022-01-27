import { Router } from "@vaadin/router";
import { state } from "../../state";
import Dropzone from "dropzone";
import { initMap, initSearchForm, setMarket } from "../../lib/mapbox";

class ReportPetsPage extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }

  listeners() {
    const dropBtnEl = this.shadow.querySelector(".btn__green");
    const petImgEl = this.shadow.querySelector(".report-pets__img");
    const myDropzone = new Dropzone(dropBtnEl, {
      url: "/falsa",
      autoProcessQueue: false,
      thumbnailWidth: 323,
      thumbnailHeight: 149,
      clickable: true,
      previewsContainer: petImgEl,

      thumbnail: function (file, dataUrl) {
        petImgEl.setAttribute("src", dataUrl);
        const cs = state.getState();
        cs.pet.petImgURL = file.dataURL;
        state.setState(cs);
      },
    });

    dropBtnEl.addEventListener("click", function (e) {
      e.preventDefault();
      myDropzone.processQueue();
    });

    const queryEl = this.shadow.querySelector(".report-pets__input-search");
    const mapEl = this.shadow.querySelector(".report-pets__mapbox");
    const mapInitial = initMap(mapEl);

    queryEl.addEventListener("change", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const location = target.value;
      const resultado = initSearchForm(location);
      resultado.then((respuesta) => {
        const [lng, lat] = respuesta.entity.features[0].geometry.coordinates;
        setMarket([lng, lat], mapInitial);
        const cs = state.getState();
        cs.pet.petLoc.lng = lng;
        cs.pet.petLoc.lat = lat;
        state.setState(cs);
      });
    });

    const formEl = this.shadow.querySelector(".report-pets__form");
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const petName = target.name.value;
      const petPlaceLost = target.search.value;
      state.setPetName(petName);
      state.setPetPlaceLost(petPlaceLost);
      state.createPet((result) => {
        if (result.newPet == true && result.updateUser == true) {
          alert("Su mascota fue reportada con éxito");
        } else {
          alert(
            "Hubo un problema con la carga de su mascota, por favor intente más tarde"
          );
        }
      });
    });

    const cancelEl = this.shadow.querySelector(".btn__greey");
    cancelEl.addEventListener("click", () => {
      Router.go("/my-pets");
    });
  }

  render() {
    const sectionEl = document.createElement("section");
    sectionEl.className = "report-pets";
    sectionEl.innerHTML = `
    <div class="report-pets__container">
      <custom-header></custom-header>
    <div class="report-pets__container-title">
        <custom-text tag="h1" size="40px">Reportar Mascota Perdida</custom-text>
    </div>

    <form class="report-pets__form">
      <fieldset class="report-pets__fieldset-name">
        <label class="report-pets__label-name" for="name">NOMBRE</label>
          <input
            class="report-pets__input-name"
            id="name"
            name="name"
            type="text"
            placeholder="Ingresa el nombre de tú mascota"
          />
      </fieldset>
  
      <div class="report-pets__dropzone-container">
          <div class="report-pets__img-container">
              <img class="report-pets__img" />
          </div>
          <div class="report-pets__container-btn">
              <button class="report-pets__form-btn btn__green">agregar / modificar foto</button>
          </div>
      </div>

      <div class="report-pets__mapbox-container">
          <div class="report-pets__mapbox">
          </div>
      </div>

      <fieldset class="report-pets__fieldset-search">
        <label class="report-pets__label-search" for="search">UBICACIÓN</label>
          <input
            class="report-pets__input-search"
            id="search"
            name="search"
            type="search"
            placeholder="Ingresa una ubicación"
          />
      </fieldset>

      <div class="report-pets__container-text">
      <custom-text size="16px">Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</custom-text>
      </div>

      <div class="report-pets__container-report-cancel-btn">
      <div class="report-pets__container-btn">
        <button class="report-pets__form-btn">Reportar como perdido</button>
      </div>

      <div class="report-pets__container-btn">
        <button class="report-pets__form-btn btn__greey">Cancelar</button>
      </div>
      </div>
    </form>
  </div>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
    .report-pets__container{
        box-sizing: border-box;
        max-width:100%;
        height:1281px;
        padding:0px 26px;
        display:flex;
        flex-direction:column;
        align-items:center;
    }

    .report-pets__container-title{
      width: 100%;
      padding-top: 20px;
      padding-bottom: 30px;
      text-align: left;
    }

    .report-pets__form {
      width: 100%;
      height: calc(25px + 50px + 36px + 142px + 18px + 50px + 36px + 208px + 20px + 25px + 50px + 18px + 77px + 36px + 100px + 18px);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
    } 

    .report-pets__dropzone-container{
      width:100%;
    }

    .report-pets__img-container{
      box-sizing: border-box;
      width:100%;
      height:142px;
      background: rgba( 255, 255, 255, 0.25 );
      box-shadow: 0 8px 32px 0 rgba( 211, 213, 79, 0.5 );
      border-radius:5px;
      border: 1px dashed black;
      margin-bottom:18px;
      margin-top:36px;
      overflow:hidden;
    }
    
    .report-pets__img{
      width:100%;
      height:142px;
      overflow:hidden;
    }
    
    .report-pets__mapbox-container{
      width:100%;
      height:208px;
      border-radius:5px;
      margin-bottom:18px;
      margin-top:36px;
    }

    .report-pets__mapbox{
      width:100%;
      height:208px;
      overflow:hidden;
    }

    .report-pets__container-text{
      width: 100%;
      height: 77px;
      margin-bottom:36px;
      margin-top:18px;
    }

    .report-pets__fieldset-name, .report-pets__fieldset-search  {
      box-sizing: border-box;
      width:100%;
      height: calc(25px + 50px + 2px);
      margin:0;
      padding:0;
      border:none;
    }

    .report-pets__label-name, .report-pets__label-search{
      display: block;
      font-weight: 500;
      margin-bottom:2px;
    }

    .report-pets__input-name, .report-pets__input-search {
      box-sizing: border-box;
      width:100%;
      height:50px;
      border: none;
      border-radius: 5px;
      padding-left:10px;
    }

    .report-pets__input-search{
      margin-bottom:10px;
    }

    .report-pets__input-name::placeholder, .report-pets__input-search::placeholder{
      color:#6A097D;
      font-size:14px;
    }

    .report-pets__container-btn {
      width: 100%;
      height: 50px;
      border: none;
      border-radius: 5px;
    }
    
    .report-pets__form-btn {
      min-width: 100%;
      min-height: 100%;
      background-color: var(--btn-bg1);
      border: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 700;
      color: var(--font-colorWht)
    }
    
    .report-pets__container-report-cancel-btn{
      width: 100%;
      height: 118px;
      display:flex;
      flex-direction:column;
      justify-content:space-between
    }
    
    .btn__green{
      background-color: var(--btn-bg2);
      color: var(--font-colorBlk)
    }
    .btn__greey{
      background-color: var(--btn-bg3);
      color: var(--font-colorBlk)
    }

    `;
    this.shadow.appendChild(sectionEl);
    this.shadow.appendChild(style);
    this.listeners();
  }
}
window.customElements.define("x-report-pets-page", ReportPetsPage);
