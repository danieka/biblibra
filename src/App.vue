<script lang="ts">
import { defineComponent } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { allBooks } from "./graphql/books";
import CreateBook from "./books/Create.vue";

export default defineComponent({
  name: "App",
  components: { CreateBook },
  setup() {
    const { result } = useQuery(allBooks);

    console.error(result);

    return {
      books: result,
    };
  },
});
</script>
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  {{ books }}
  <create-book></create-book>
</template>
