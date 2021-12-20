import { Router } from "@vaadin/router";

const rootEl = document.querySelector(".root");
const router = new Router(rootEl);

router.setRoutes([
  { path: "/", component: "x-welcome-page" },
  { path: "/welcome", component: "x-welcome-page" },
  { path: "/edit-pet", component: "x-edit-pets-page" },
  { path: "/me", component: "x-me-page" },
  { path: "/my-pets", component: "x-my-pets-page" },
  { path: "/pets-around", component: "x-pets-around-page" },
  { path: "/report-pets", component: "x-report-pets-page" },
  { path: "/sign-in", component: "x-sign-in-page" },
  { path: "/sign-up", component: "x-sign-up-page" },
]);
