import { Router } from "@vaadin/router";
import { state } from "../../state";
class SignInPage extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  listeners() {
    const formEl = this.shadow.querySelector(".sign-in__form");
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const userEmail = target.email.value;
      state.setUserEmail(userEmail);
      state.getUserId().then((res) => {
        if (res.user_id > 0) {
          state.setUserId(res.user_id);
          state.setUserName(res.userName);
          Router.go("/auth");
        } else {
          Router.go("/me");
        }
      });
    });
  }

  render() {
    const sectionEl = document.createElement("section");
    sectionEl.className = "sign-in";
    sectionEl.innerHTML = `
    <div class="sign-in__container">
      <custom-header></custom-header>
    <div class="sign-in__container-title">
        <custom-text tag="h1" size="40px">Ingresar</custom-text>
    </div>
    <form class="sign-in__form">
      <fieldset class="sign-in__fieldset">
        <label class="sign-in__label-email" for="email">Email</label>
          <input
            class="sign-in__input-email"
            id="email"
            name="email"
            type="text"
            placeholder="Ingresa tu email"
            required
          />
      </fieldset>
      <div class="sign-in__container-btn">
        <button class="sign-in__form-btn">Siguiente</button>
      </div>
    </form>
  </div>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
    .sign-in__container{
        box-sizing: border-box;
        max-width:100%;
        height:100vh;
        padding:0px 26px;
        display:flex;
        flex-direction:column;
        align-items:center;
    }

    .sign-in__container-title{
      width: 100%;
      padding-top: 20px;
      padding-bottom: 40px;
      text-align: center;
    }

    .sign-in__form {
      width: 100%;
      height: 175px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
    } 

    .sign-in__fieldset {
      box-sizing: border-box;
      width:100%;
      height: calc(25px + 50px + 2px);
      margin:0;
      padding:0;
      border:none;
    }

    .sign-in__label-email {
      display: block;
      font-weight: 500;
      margin-bottom:2px;
    }

    .sign-in__input-email {
      box-sizing: border-box;
      width:100%;
      height:50px;
      border: none;
      border-radius: 2px;
      padding-left:10px;
    }

    .sign-in__input-email::placeholder{
      color:#6A097D;
      font-size:14px;
    }

    .sign-in__container-btn {
      width: 100%;
      height: 50px;
      border: none;
      border-radius: 2px;
    }

    .sign-in__form-btn {
      min-width: 100%;
      min-height: 100%;
      background-color: var(--btn-bg1);
      border: none;
      border-radius: 2px;
      font-size: 16px;
      font-weight: 700;
      color: var(--font-colorWht);
      cursor:pointer;
    }
    `;
    this.shadow.appendChild(sectionEl);
    this.shadow.appendChild(style);
    this.listeners();
  }
}
customElements.define("x-sign-in-page", SignInPage);
