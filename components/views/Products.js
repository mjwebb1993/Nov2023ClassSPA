import html from "html-literal";

export default state => html`
  <table id="pizzas">
    <tr>
      <th>Image</th>
      <th>Title</th>
      <th>Price</th>
      <th>Category</th>
      <th>Description</th>
    </tr>
    ${state.products
      .map(product => {
        return html`
          <tr>
            <td>
              <img src="${product.image}" style="width: 50px;" />
            </td>
            <td>${product.title}</td>
            <td>$${product.price}</td>
            <td>${product.category}</td>
            <td>${product.description}</td>
          </tr>
        `;
      })
      .join("")}
  </table>
`;
