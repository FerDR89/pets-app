import { Router } from "@vaadin/router";
import { state } from "../../state";
class MePage extends HTMLElement {
  shadow: ShadowRoot;
  cs;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.cs = state.getState();
  }
  connectedCallback() {
    this.render();
  }
  listeners() {
    const formEl = this.shadow.querySelector(".me-page__form");
    const userToken = this.cs.user.userToken;

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const name = target.name.value;
      state.setUserName(name);
      const password = target.password.value;
      const repeatPassword = target["repeat-pass"].value;

      if (password && repeatPassword) {
        const validPass = this.checkPassword(password, repeatPassword);
        if (!userToken) {
          if (validPass) {
            console.log("NO TIENEN TOKE Y LA PASS ES VALIDA");

            state.setUserData(validPass);
            Router.go("/sign-in");
            console.log("Estoy en mis datos dentro del newUser");
          }
        } else {
          console.log("TIENEN TOKE Y LA PASS ES VALIDA");
          if (validPass) {
            state.updateUserData(validPass);
            alert("Sus datos han sido actualizados correctamente");
          }
        }
      } else {
        console.log("TIENEN TOKE Y NO TIENE PASS");
        state.updateUserData();
        alert("Sus datos han sido actualizados correctamente");
      }
    });
  }

  checkPassword(pass, repeat) {
    if (pass.length < 8 && repeat.length < 8) {
      alert(
        "Por favor revise la contraseña ingresada, la misma debe contener al menos 8 carácteres"
      );
    } else if (pass === repeat) {
      return pass;
    } else {
      alert("Por favor ingrese la misma contraseña en ambos campos");
    }
  }

  render() {
    const sectionEl = document.createElement("section");
    sectionEl.className = "me-page";
    sectionEl.innerHTML = `
    <div class="me-page__container">
      <custom-header></custom-header>
    <div class="me-page__container-title">
        <custom-text tag="h1" size="40px">Mis datos</custom-text>
    </div>
    <form class="me-page__form">
      <fieldset class="me-page__fieldset-name">
        <label class="me-page__label-name" for="name">NOMBRE</label>
          <input
            class="me-page__input-name"
            id="name"
            name="name"
            type="text"
            placeholder="Ingresa tu nombre"
            autofocus
          />
      </fieldset>
      <fieldset class="me-page__fieldset-pass">
      <label class="me-page__label-password" for="password">CONTRASEÑA</label>
        <input
          class="me-page__input-password"
          id="password"
          name="password"
          type="password"
          placeholder="Ingresa tu contraseña"
        />
        <label class="me-page__label-repeat-pass" for="repeat-pass">REPETIR CONTRASEÑA</label>
        <input
          class="me-page__input-repeat-pass"
          id="repeat-pass"
          name="repeat-pass"
          type="password"
          placeholder="Ingresa nuevamente tu contraseña"
        />
    </fieldset>
      <div class="me-page__container-btn">
        <button class="me-page__form-btn">Guardar</button>
      </div>
    </form>
  </div>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
    .me-page__container{
        box-sizing: border-box;
        max-width:100%;
        height:100vh;
        padding:0px 26px;
        display:flex;
        flex-direction:column;
        align-items:center;
    }

    .me-page__container-title{
      width: 100%;
      padding-top: 20px;
      padding-bottom: 40px;
      text-align: left;
    }

    .me-page__form {
      width: 100%;
      height: calc(25px + 50px + 71px + 50px + 110px + 59px + 50px);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    } 

    .me-page__fieldset-name {
      box-sizing: border-box;
      width:100%;
      height: calc(25px + 50px + 2px);
      margin:0;
      padding:0;
      border:none;
    }

    .me-page__fieldset-pass {
      box-sizing: border-box;
      width:100%;
      height: calc(50px + 100px + 4px + 10px);
      margin:0;
      padding:0;
      border:none;
    }

    .me-page__label-name, .me-page__label-password, .me-page__label-repeat-pass  {
      display: block;
      font-weight: 500;
      margin-bottom:2px;
    }

    .me-page__input-name, .me-page__input-password, .me-page__input-repeat-pass {
      box-sizing: border-box;
      width:100%;
      height:50px;
      border: none;
      border-radius: 5px;
      padding-left:10px;
    }

    .me-page__input-password{
      margin-bottom:10px;
    }

    .me-page__input-name::placeholder, .me-page__input-password::placeholder, .me-page__input-repeat-pass::placeholder{
      color:#6A097D;
      font-size:14px;
    }

    .me-page__container-btn {
      width: 100%;
      height: 50px;
      border: none;
      border-radius: 5px;
    }

    .me-page__form-btn {
      min-width: 100%;
      min-height: 100%;
      background-color: var(--btn-bg1);
      border: none;
      border-radius: 5px;
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
window.customElements.define("x-me-page", MePage);
