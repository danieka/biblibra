<script lang="ts">
import { useQuery } from "@vue/apollo-composable";
import { defineComponent } from "vue";
import { allBooks } from "../graphql/books";

export default defineComponent({
  name: "Home",
  setup() {
    const { result } = useQuery(allBooks);

    return {
      result,
    };
  },
});
</script>
<template>
  <h1>Books</h1>
  <template v-if="result">
    <div v-for="book in result.books" :key="book.id">
      {{ book.title }}
    </div>
  </template>
  <router-link to="/books/create"><a>New book</a></router-link>
</template>
