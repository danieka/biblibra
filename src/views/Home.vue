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
  <div v-if="result">
    <router-link
      v-for="book in result.books"
      :key="book.id"
      :to="`/books/${book.id}`"
      class="block bg-white p-2 border-gray-300 border border-b-0 last:border-b first:rounded-t last:rounded-b"
    >
      {{ book.title }}
    </router-link>
  </div>
  <div class="flex mt-4 justify-center">
    <router-link to="/books/create">
      <button class="button text-white bg-blue-600 hover:bg-blue-700">
        New book
      </button>
    </router-link>
  </div>
</template>
