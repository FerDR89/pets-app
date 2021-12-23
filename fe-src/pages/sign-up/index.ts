import { Router } from "@vaadin/router";
import { state } from "../../state";
class SignUpPage extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  // connectedCallback() {
  //   this.render();
  // }
  // listeners() {}

  // render() {
  //   const sectionEl = document.createElement("section");
  //   sectionEl.className = "welcome";
  //   sectionEl.innerHTML = `
  //   <div class="welcome__container">
  //   <div class="welcome__container-title">
  //       <custom-text tag="h1" size="80px">Piedra, Papel, ó Tijera</custom-text>
  //   </div>
  //   <div class="welcome__container-btns">
  //       <div class="welcome__container-btn">
  //           <custom-button class="btn__new-game">Nuevo juego</custom-button>
  //       </div>
  //       <div class="welcome__container-btn">
  //           <custom-button class="btn__enter-room">Ingresar a una sala</custom-button>
  //       </div>
  //   </div>
  //   <div class="welcome__container-hands">
  //       <hands-el tag="scissors" width="65px" height="125px"></hands-el>
  //       <hands-el tag="stone" width="65px" height="125px"></hands-el>
  //       <hands-el tag="paper" width="65px" height="125px"></hands-el>
  //   </div>
  // </div>
  //   `;
  //   const style = document.createElement("style");
  //   style.innerHTML = `
  //   .welcome__container{
  //       box-sizing: border-box;
  //       max-width:100%;
  //       height:100vh;
  //       padding:0px 26px;
  //       display:flex;
  //       flex-direction:column;
  //       align-items:center;
  //       justify-content:space-between;
  //   }
  //   @media(min-width:376px){
  //     .welcome__container{
  //       width:100%;
  //       height:100vh;
  //       padding:0px;
  //   }}

  //   .welcome__container-title{
  //     width:284px;
  //     height:280px;
  //     padding-top:20px;
  //   }

  //   .welcome__container-btns{
  //       height:195px;
  //       display:flex;
  //       flex-direction:column;
  //       justify-content:space-between;
  //     }
  //     .welcome__container-btn{
  //       width:322px;
  //       height:87px;
  //     }
  //     .welcome__container-hands{
  //       width:273px;
  //       height:130px;
  //       display:flex;
  //       align-items:center;
  //       justify-content:space-between;
  //     }
  //   `;
  //   this.shadow.appendChild(sectionEl);
  //   this.shadow.appendChild(style);
  //   this.listeners();
  // }
}
window.customElements.define("x-sign-up-page", SignUpPage);
