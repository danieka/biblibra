<script lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { defineComponent } from "vue";
import {
  addBookMutation,
  allBooks,
  getBookDataMutation,
} from "../graphql/books";
import Quagga from "quagga";
import { countBy, identity, chain, pickBy } from "lodash";

import schema from "../../schema.json";

const fields = schema.__schema.types
  .find((t) => t.name === "books")
  .fields.filter((f) => !["id", "isbn"].includes(f.name));

export default defineComponent({
  name: "CreateBook",
  setup() {
    const humanize = (s: string) => s.replace("_", " ");

    const { mutate: addBook } = useMutation(addBookMutation, () => ({
      update: (cache, { data: { insert_books_one } }) => {
        const data = cache.readQuery<Record<string, unknown[]>>({
          query: allBooks,
        });
        cache.writeQuery({
          query: allBooks,
          data: { books: [...data.books, insert_books_one] },
        });
      },
    }));

    const { mutate: getBookData } = useMutation(getBookDataMutation);
    return {
      fields,
      humanize,
      addBook,
      getBookData,
    };
  },
  data: () => ({
    data: {},
    scanning: false,
  }),
  watch: {
    scanning() {
      if (!this.scanning) {
        Quagga.stop();
        return;
      }
      setTimeout(() =>
        Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: document.querySelector("#camera-view"),
            },
            decoder: {
              readers: ["ean_reader"],
            },
          },
          (err) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();

            const codes = [];

            Quagga.onDetected((data) => {
              const isbn = data.codeResult.code;
              codes.push(isbn);
              if (codes.length > 10) {
                console.log(
                  "Found code",
                  codes.length,
                  chain(codes)
                    .countBy()
                    .toPairs()
                    .sortBy((l) => -l[1])
                    .value()[0][0]
                );

                Quagga.stop();
                this.scanning = false;
                this.onISBNChange(
                  chain(codes)
                    .countBy()
                    .toPairs()
                    .sortBy((l) => -l[1])
                    .value()[0][0]
                );
              }
            });
          }
        )
      );
    },
  },
  methods: {
    cancel() {
      this.$router.back();
    },
    async create() {
      this.data.pages = parseInt(this.data.pages);
      await this.addBook({
        object: pickBy(this.data, (value, key) =>
          schema.__schema.types
            .find((t) => t.name === "books")
            .fields.find((f) => f.name === key)
        ),
      });
      this.$router.back();
    },
    async onISBNChange(isbn: string) {
      const res = await this.getBookData({ isbn });
      console.log("got result", res);
      Object.assign(this.data, res.data.getBookData);
    },
  },
});
</script>
<template>
  <template v-if="scanning">
    <div id="camera-view"></div>
    <div class="flex flex-row justify-center space-x-6 mt-4">
      <button
        class="button bg-gray-100 hover:bg-gray-200"
        @click="scanning = false"
      >
        Cancel
      </button>
    </div>
  </template>
  <template v-else>
    <div
      class="flex content-center justify-between items-center pr-2 space-x-4"
    >
      <div
        class="flex flex-col items-stretch text-left py-1 capitalize flex-grow"
      >
        <label id="isbn">ISBN</label>
        <input
          v-model="data['isbn']"
          type="number"
          for="isbn"
          @blur="onISBNChange(data.isbn)"
        />
      </div>
      <ion-icon name="camera" size="large" @click="scanning = true"></ion-icon>
    </div>
    <div
      v-for="(field, key) in fields"
      :key="key"
      class="flex flex-col items-stretch text-left py-1 capitalize"
    >
      <template v-if="field.type.name === 'bytea'">
        <label :id="field.name">{{ humanize(field.name) }}</label>
        <input type="file" :for="field.name" />
      </template>
      <template
        v-else-if="field.type.ofType && field.type.ofType.name === 'Int'"
      >
        <label :id="field.name">{{ humanize(field.name) }}</label>
        <input v-model="data[field.name]" type="number" :for="field.name" />
      </template>
      <template v-else>
        <label :id="field.name">{{ humanize(field.name) }}</label>
        <input v-model="data[field.name]" type="text" :for="field.name" />
      </template>
    </div>
    <div class="flex flex-row justify-center space-x-6 mt-4">
      <button class="button bg-gray-100 hover:bg-gray-200" @click="cancel">
        Cancel
      </button>
      <button
        class="button text-white bg-green-600 hover:bg-green-700"
        @click="create"
      >
        Create
      </button>
    </div>
  </template>
</template>
<style lang="postcss">
input {
  @apply border p-2;
}

.drawingBuffer {
  display: none;
}
</style>
