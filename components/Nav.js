import html from "html-literal";

export default (links, state) => html`
  <nav>
    <i class="fas fa-bars"></i>
    <ul class="hidden--mobile nav-links">
      ${links
        .map(
          link =>
            html`
              <li ${state.view === link.title ? `class="active"` : ""}>
                <a href="/${link.title}" title="${link.title}" data-navigo>
                  ${link.text}
                </a>
              </li>
            `
        )
        .join("")}
    </ul>
  </nav>
`;
