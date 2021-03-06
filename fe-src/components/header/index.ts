const icon = require("../../assets/pet-icon.png");
import { Router } from "@vaadin/router";
import { stat } from "fs";
import { state } from "../../state";

class CustomHeader extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }

  listeners() {
    const toggle = this.shadow.querySelector(".header__menu-burguer");
    const menuMobile = this.shadow.querySelector(".header__menu-container");

    toggle.addEventListener("click", () => {
      toggle.classList.toggle("active");
      menuMobile.classList.toggle("show");
    });

    function itemMenuListener(e) {
      const cs = state.getState();
      const userEmail = cs.user.userEmail;
      const userToken = cs.user.userToken;
      const linkRef = this.getAttribute("link");
      if (userEmail && userToken) {
        Router.go(linkRef);
      } else {
        state.setUserRoute(linkRef);
        Router.go("/sign-in");
      }
    }

    const meEl = this.shadow.querySelector(".me");
    const myPetsEl = this.shadow.querySelector(".my-pets");
    const reportPetsEl = this.shadow.querySelector(".report-pets");

    meEl.addEventListener("click", itemMenuListener);
    myPetsEl.addEventListener("click", itemMenuListener);
    reportPetsEl.addEventListener("click", itemMenuListener);

    const closeSesion = this.shadow.querySelector(".header__close-sesion");
    closeSesion.addEventListener("click", () => {
      state.resetState(() => {
        toggle.classList.toggle("active");
        menuMobile.classList.toggle("show");
        Router.go("/welcome");
      });
    });
  }

  render() {
    const cs = state.getState();
    const { userEmail } = cs.user;
    const headerEl = document.createElement("header");
    headerEl.className = "header";
    headerEl.innerHTML = `
      <div class="header__img-container">
        <a href="/welcome">
          <img src="${icon}" alt="dog and cat image" class="header__img" />
        </a>
      </div>
      <nav class="header__menu-nav">
      <div class="header__menu-burguer"></div>
        <div class="header__menu-container">
          <ul class="header__menu-list">
            <li class="header__menu-item">
              <a class="header__menu-link me" link="/me">Mis datos</a>
            </li>
            <li class="header__menu-item">
              <a class="header__menu-link my-pets" link="/my-pets">Mis mascotas reportadas</a>
            </li>
            <li class="header__menu-item">
              <a class="header__menu-link report-pets" link="/report-pets">Reportar mascotas</a>
            </li>
          </ul>
          <div class="header__sesion-container">
          <p class="header__user-email">${userEmail}</p>
            <a href="/welcome" class="header__close-sesion">Cerrar sesi??n</a>
          </div>
        </div>
      </nav>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
      .header{
        box-sizing: border-box;
        min-width:375px;
        height:60px;
        padding:0px 15px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        background-color: var(--header-bgc);
      }

      .header__img-container{
        width:40px;
        height:35px;
      }
    
      .header__img{
        width:100%;
        height:100%;
      }

      .header__menu-nav{
      }
      
      .header__menu-burguer{
        width:40px;
        height:35px;
        position:relative;
        cursor:pointer;
        background-color:#37a6ff;
        display:flex;
        align-items:center;
        justify-content:center;
        transition: all 0.5s ease-out ;      
      }
      
      .header__menu-burguer::before{
        content: '';
        position:absolute;
        width:28px;
        height:2px;
        background-color:#fff;
        transform:translateY(-10px);
        box-shadow: 0 10px 0 #fff;
        transition: all 0.5s ease-out ;
      }
      
      .header__menu-burguer::after{
        content: '';
        position:absolute;
        width:28px;
        height:2px;
        background-color:#fff;
        transform:translateY(10px);  
        transition: all 0.5s ease-out ;      
      }
      
      .header__menu-burguer.active {
        background-color:var(--bgc);
        transition: all 0.5s ease-out ;      
      }
      
      .header__menu-burguer.active::before {
        box-shadow: 0 0 0 #fff;
        transform:translateY(0px) rotate(45deg);
        transition: all 0.5s ease-out ;      
      }
      
      .header__menu-burguer.active::after {
        transform:translateY(0px) rotate(-45deg);
        transition: all 0.5s ease-out ;      
      }
      
      .header__menu-container{
        height:calc(100vh - 60px);
        width:375px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:space-evenly;
        background-color:var(--header-bgc);
        position:absolute;
        top:60px;
        left:-400px; 
        transition: left 1s ease-in-out ;    
      }
      
      .header__menu-container.show{     
        left:0px;  
      }

      .header__menu-list{
        margin:0;
        padding:0;
        height:300px;
        width:100%;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:space-evenly;      
      }

      .header__menu-item{
        list-style: none;
        display:block;
      }

      .header__menu-link{
        display:block;
        width:100%;
        height:33px;
        text-decoration:none;
        font-size:24px;
        font-weight:700;
        color: var(--font-colorBlk);
        cursor:pointer;
      }

      .header__sesion-container{
        width:100%;
        height:65px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:space-between;   
      }

      .header__user-email{
        margin:0px;
        font-size:24px;
        font-weight:400;
        color: var(--font-colorBlk)
      }
      
      .header__close-sesion{
        text-transform:uppercase;
        color: var(--font-link-color);
        cursor:pointer;
      }
      `;
    this.shadow.appendChild(style);
    this.shadow.appendChild(headerEl);
    this.listeners();
  }
}
customElements.define("custom-header", CustomHeader);
