import html from "html-literal";

export default state => {
  console.log(state);

  return html`
    <header>
      <h1>${state.header}</h1>

      <select name="brand" id="brand">
        <option value="default">Default</option>
        <option value="brandGreen">Green Brand</option>
        <option value="brandBlue">Blue Brand</option>
      </select>
    </header>
  `;
};
