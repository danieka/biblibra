import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

import { apolloClient } from "./graphql";
import { allBooks } from "./graphql/books.ts";
import { DefaultApolloClient } from "@vue/apollo-composable";

apolloClient
  .query({
    query: allBooks,
  })
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

createApp(App).provide(DefaultApolloClient, apolloClient).mount("#app");
