import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

import { apolloClient } from "./graphql";
import { allBooks } from "./graphql/books.ts";
import { DefaultApolloClient } from "@vue/apollo-composable";

import { routes } from "./routes";
import { createRouter, createWebHistory } from "vue-router";

let app = createApp(App);

let router = createRouter({
  history: createWebHistory(),
  routes: import.meta.hot ? [] : routes,
});

if (import.meta.hot) {
  let removeRoutes = [];

  for (let route of routes) {
    removeRoutes.push(router.addRoute(route));
  }

  import.meta.hot.acceptDeps("./routes.ts", ({ routes }) => {
    for (let removeRoute of removeRoutes) removeRoute();
    removeRoutes = [];
    for (let route of routes) {
      removeRoutes.push(router.addRoute(route));
    }
    router.replace("");
  });
}

apolloClient
  .query({
    query: allBooks,
  })
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

app.provide(DefaultApolloClient, apolloClient);
app.use(router);
app.mount("#app");
