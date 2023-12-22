import html from "html-literal";
import * as views from "./views";

export default state =>
  // views.Home(state)
  html`
    ${views[state.view](state)}
  `;
