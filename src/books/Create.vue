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
});
</script>
<template>
  <div v-for="(field, key) in fields" :key="key">
    <template v-if="field.type.name === 'bytea'">
      <label :id="field.name">{{ humanize(field.name) }}</label>
      <input type="file" :for="fieldname" />
    </template>
    <template v-else>
      <label :id="field.name">{{ humanize(field.name) }}</label>
      <input type="text" :for="fieldname" />
    </template>
  </div>
</template>
