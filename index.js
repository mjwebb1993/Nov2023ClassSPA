import { Header, Nav, Main, Footer } from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";

const router = new Navigo("/");

function render(state = store.Home) {
  document.querySelector("#root").innerHTML = `
    ${Header(state)}
    ${Nav(store.Links, state)}
    ${Main(state)}
    ${Footer()}
  `;

  router.updatePageLinks();
  afterRender(state);
}

function afterRender(state) {
  // add menu toggle to bars icon in nav bar
  document.querySelector(".fa-bars").addEventListener("click", () => {
    document.querySelector("nav > ul").classList.toggle("hidden--mobile");
  });

  if (state.view === "Home") {
    // Do this stuff
    document.getElementById("callToAction").addEventListener("click", event => {
      event.preventDefault();

      router.navigate("/pizza");
    });
  }

  if (state.view === "Order") {
    document.querySelector("form").addEventListener("submit", event => {
      event.preventDefault();

      let inputs = event.target.elements;

      store.Pizza.pizzas.push({
        crust: inputs.crust.value,
        cheese: event.target.elements.cheese.value,
        customer: event.target.elements.customer.value,
        sauce: event.target.elements.sauce.value,
        toppings: []
      });

      console.log(store.Pizza.pizzas);

      router.navigate("/Pizza");
    });
  }
}

router.hooks({
  before: async (done, params) => {
    // We need to know what view we are on to know what data to fetch
    const view =
      params && params.data && params.data.view
        ? capitalize(params.data.view)
        : "Home";
    // Add a switch case statement to handle multiple routes
    switch (view) {
      // New Case for the Home View
      case "Home":
        axios
          // Get request to retrieve the current weather data using the API key and providing a city name
          .get(
            `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}&q=chicago`
          )
          .then(response => {
            // Convert Kelvin to Fahrenheit since OpenWeatherMap does provide otherwise
            const kelvinToFahrenheit = kelvinTemp =>
              Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);

            // Create an object to be stored in the Home state from the response
            store.Home.weather = {
              city: response.data.name,
              temp: kelvinToFahrenheit(response.data.main.temp),
              feelsLike: kelvinToFahrenheit(response.data.main.feels_like),
              description: response.data.weather[0].main
            };

            // An alternate method would be to store the values independently
            /*
            store.Home.weather.city = response.data.name;
            store.Home.weather.temp = kelvinToFahrenheit(response.data.main.temp);
            store.Home.weather.feelsLike = kelvinToFahrenheit(response.data.main.feels_like);
            store.Home.weather.description = response.data.weather[0].main;
            */
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
        break;

      // Add a case for each view that needs data from an API
      case "Pizza":
        // New Axios get request utilizing already made environment variable
        axios
          .get(`${process.env.PIZZA_PLACE_API_URL}/pizzas`)
          .then(response => {
            // We need to store the response to the state, in the next step but in the meantime
            //   let's see what it looks like so that we know what to store from the response.
            console.log("response", response.data);
            store.Pizza.pizzas = response.data;

            done();
          })
          .catch(error => {
            console.log("It puked", error);
            done();
          });
        break;
      case "Products": {
        // try {
        //   const response = await axios.get("https://fakestoreapi.com/products");

        //   store.Products.products = response.data;

        //   done();
        // } catch (error) {
        //   console.error(error.message);
        // }

        axios.get("https://fakestoreapi.com/products").then(response => {
          store.Products.products = response.data;

          done();
        });
        break;
      }
      default:
        done();
    }
  },
  already: params => {
    const view =
      params && params.data && params.data.view
        ? capitalize(params.data.view)
        : "Home";

    render(store[view]);
  }
});

router
  .on({
    "/": () => render(),
    ":view": params => {
      let view = capitalize(params.data.view);
      if (view in store) {
        render(store[view]);
      } else {
        render(store.Viewnotfound);
        console.log(`View ${view} not defined`);
      }
    }
  })
  .resolve();
