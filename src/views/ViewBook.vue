<script lang="ts">
import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
import { bookByPk } from "../graphql/books";
import { defineComponent, Ref, ref } from "vue";
import BookForm from "../components/BookForm.vue";
import AppBar from "../components/AppBar.vue";
import { assert } from "../graphql/utils";
export default defineComponent({
  components: { BookForm, AppBar },
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

    const form: Ref<null | typeof BookForm> = ref(null)

    const book = useResult(result, null, (data) => data.books_by_pk);

    return {
      book,
      form,
    };
  },
  data: () => ({
    edit: false,
    valid: true,
    formData: {}
  }),
  methods: {
    cancel() {
      this.edit = false
      assert(!!this.form)
      this.form.cancel()
    },
    save() {
      
    }
  }
});
</script>
<template>
  <app-bar v-if="book">
    {{ book.title }}
    <template #button>
      <button v-if="!edit" class="text-blue-400" @click="edit = true">Edit</button>
    <template>
  </app-bar>
  <div class="p-2">
    <book-form v-if="book" ref="form" :model-value="book" v-model:valid="valid" :readonly="!edit" @update:model-value="formData = $event"></book-form>
    <div v-if="edit" class="flex flex-row justify-center space-x-6 mt-4">
      <button class="button bg-gray-100 hover:bg-gray-200" @click="cancel">
        Cancel
      </button>
      <button
        class="button text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        :disabled="!valid"
        @click="save"
      >
        Save
      </button>
    </div>
  </div>
</template>
