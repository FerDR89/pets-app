const editIcon = require("../../assets/editar.png");

class CustomCard extends HTMLElement {
  shadow: ShadowRoot;
  petId: number;
  petImg: string;
  petName: string;
  petLoc: string;
  cardView: string;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.petId = parseInt(this.getAttribute("petId"));
    this.petImg = this.getAttribute("petImg");
    this.petName = this.getAttribute("petName");
    this.petLoc = this.getAttribute("petLoc");
    this.cardView = this.getAttribute("cardView");
  }
  connectedCallback() {
    this.render();
  }

  listeners() {
    const cardView = this.cardView;
    const linkReportEl =
      this.shadow.querySelector(".card__report-link") ||
      this.shadow.querySelector(".card__edit-icon");
    linkReportEl.addEventListener("click", () => {
      const report = new CustomEvent("report", {
        detail: {
          petId: this.petId,
        },
        bubbles: true,
      });
      this.dispatchEvent(report);
    });
  }

  selectViewCard() {
    const cardView = this.cardView;
    const cardReportEl = this.shadow.querySelector(".card__report-container");
    if (cardView == "link") {
      cardReportEl.innerHTML = `
      <custom-text class="card__report-link" size="16px" style="color:var(--font-link-color); text-decoration-line:underline; text-transform:uppercase; cursor:pointer;">reportar información</custom-text>
      `;
    } else {
      cardReportEl.innerHTML = `
      <img src="${editIcon}" alt="pen image" class="card__edit-icon" />  
      `;
    }
  }

  render() {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.innerHTML = `
          <div class="card__img-container">
              <img src=${this.petImg} alt="pet image" class="card__img"/>
          </div>
          <div class="card__text-container">
            <div class="card__info-container">
                <div class="card__name-container">
                  <custom-text tag="h3" size="40px">${this.petName}</custom-text>
                </div>
                <div class="card__location-container">
                  <custom-text size="16px">${this.petLoc}</custom-text>
                </div>
            </div>
            <div class="card__report-container">
            </div>
          </div>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
    .card {
      box-sizing: border-box;
      width:335px;
      height:235px;
      background: rgba( 255, 255, 255, 0.25 );
      box-shadow: 0 8px 32px 0 rgba( 211, 213, 79, 0.5 );
      border-radius: 10px;
      margin-bottom:15px;
    }
    .card__img-container {
      box-sizing: border-box;
      width:100%;
      height:150px; 
    }
    
    .card__img {
      width:100%;
      height:100%;
      object-fit: fill;
      border-radius: 10px 10px 3px 3px;
    }

    .card__text-container {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      height: 85px;
      padding:0 10px;
    }
    .card__info-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-evenly;
      width: 100%;
      height: 100%;
    }
    
    .card__name-container, .card__location-container{
      overflow: hidden;
      width: 157px;
      word-break: break-word;
      height: 25px;
    }
    .card__name-container{
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .card__edit-icon{
      width: 30px;
      height: 30px;
      cursor:pointer;
      margin-right: 20px;
    }

    .card__report-container {
      width: 100%;
      height: 100%;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
      `;
    this.shadow.appendChild(style);
    this.shadow.appendChild(cardEl);
    this.selectViewCard();
    this.listeners();
  }
}
customElements.define("custom-card", CustomCard);
