<script lang="ts">
import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
import { bookByPk } from "../graphql/books";
import { defineComponent } from "vue";
import BookForm from "../components/BookForm.vue";
export default defineComponent({
  components: { BookForm },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup({ id }) {
    const { result } = useQuery(bookByPk, () => ({
      id,
    }));

    const book = useResult(result, null, (data) => data.books_by_pk);

    return {
      book,
    };
  },
});
</script>
<template>
  <book-form v-if="book" :modelValue="book" :readonly="true"></book-form>
</template>
