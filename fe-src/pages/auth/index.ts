import { Router } from "@vaadin/router";
import { state } from "../../state";
class AuthPage extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }

  listeners() {
    const formEl = this.shadow.querySelector(".auth__form");
    const cs = state.getState();
    const userRoute = cs.user.userRoute;
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const password = target.password.value;
      state.getUserToken(password).then((res) => {
        if (res.token) {
          state.setUserToken(res.token);
          Router.go(userRoute);
        } else {
          alert(`${res.message}, Please try again`);
        }
      });
      target.password.value = "";
    });
  }

  render() {
    const sectionEl = document.createElement("section");
    sectionEl.className = "auth";
    sectionEl.innerHTML = `
    <div class="auth__container">
      <custom-header></custom-header>
    <div class="auth__container-title">
        <custom-text tag="h1" size="40px">Ingresar</custom-text>
    </div>
    <form class="auth__form">
      <fieldset class="auth__fieldset">
        <label class="auth__label-password" for="password">Contraseña</label>
          <input
            class="auth__input-password"
            id="password"
            name="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            required
          />
      </fieldset>
      <a href="/welcome" class="auth__forget-pass">Olvidé mi contraseña</a>
      <div class="auth__container-btn">
        <button class="auth__form-btn">Ingrersar</button>
      </div>
    </form>
  </div>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
    .auth__container{
        box-sizing: border-box;
        max-width:100%;
        height:100vh;
        padding:0px 26px;
        display:flex;
        flex-direction:column;
        align-items:center;
    }

    .auth__container-title{
      width: 100%;
      padding-top: 20px;
      padding-bottom: 40px;
      text-align: center;
    }

    .auth__form {
      width: 100%;
      height: 200px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
    } 

    .auth__fieldset {
      box-sizing: border-box;
      width:100%;
      height: calc(25px + 50px + 2px);
      margin:0;
      padding:0;
      border:none;
    }

    .auth__label-password {
      display: block;
      font-weight: 500;
      margin-bottom:2px;
    }

    .auth__input-password {
      box-sizing: border-box;
      width:100%;
      height:50px;
      border: none;
      border-radius: 2px;
      padding-left:10px;
    }

    .auth__input-password::placeholder{
      color:#6A097D;
      font-size:14px;
    }

    .auth__forget-pass{
      text-transform:uppercase;
      color: var(--font-link-color)
    }

    .auth__container-btn {
      width: 100%;
      height: 50px;
      border: none;
      border-radius: 2px;
    }

    .auth__form-btn {
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
window.customElements.define("x-auth-page", AuthPage);
