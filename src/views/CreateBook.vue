<script lang="ts">
import { defineComponent } from "vue";

import schema from "../../schema.json";

const fields = schema.__schema.types
  .find((t) => t.name === "books")
  .fields.filter((f) => f.name !== "id");

export default defineComponent({
  name: "CreateBook",
  setup() {
    const humanize = (s: string) => s.replace("_", " ");
    return {
      fields,
      humanize,
    };
  },
  methods: {
    cancel() {
      this.$router.back();
    },
  },
});
</script>
<template>
  <div
    v-for="(field, key) in fields"
    :key="key"
    class="flex flex-col items-stretch text-left py-1 capitalize"
  >
    <template v-if="field.type.name === 'bytea'">
      <label :id="field.name">{{ humanize(field.name) }}</label>
      <input type="file" :for="field.name" />
    </template>
    <template v-else>
      <label :id="field.name">{{ humanize(field.name) }}</label>
      <input type="text" :for="field.name" class="border p-2" />
    </template>
  </div>
  <div class="flex flex-row justify-center space-x-6 mt-4">
    <button class="button bg-gray-100 hover:bg-gray-200" @click="cancel">
      Cancel
    </button>
    <button class="button text-white bg-green-600 hover:bg-green-700">
      Create
    </button>
  </div>
</template>
<style lang="postcss" scoped>
.button {
  @apply py-2 px-4 font-semibold rounded-lg shadow-md border  focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75;
}
</style>
