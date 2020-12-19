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
  <h1 class="text-lg">Books</h1>
  <template v-if="result">
    <div v-for="book in result.books" :key="book.id">
      {{ book.title }}
    </div>
  </template>
  <router-link to="/books/create" class="block mt-4">
    <button class="button text-white bg-blue-600 hover:bg-blue-700">
      New book
    </button>
  </router-link>
</template>
