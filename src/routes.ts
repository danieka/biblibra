import Home from "./views/Home.vue";
import CreateBook from "./views/CreateBook.vue";

/** @type {import('vue-router').RouterOptions['routes']} */
export let routes = [
  { path: "/", component: Home, meta: { title: "Home" } },
  {
    path: "/books/create",
    component: CreateBook,
    meta: { title: "Create Book" },
  },
];
