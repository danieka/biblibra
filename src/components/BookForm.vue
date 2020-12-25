<script lang="ts">
import { computed, defineComponent, getCurrentInstance } from "vue";
import { find } from "lodash";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { allBookISBN, getBookDataMutation } from "../graphql/books";
import schema from "../../schema.json";
import { findModel } from "../graphql/utils";
import { error } from "../components/Toast.vue";
import ScanIsbn from "./ScanIsbn.vue";

const fields = findModel("books").fields.filter(
  (f) => !["id", "isbn"].includes(f.name)
);

export default defineComponent({
  components: { ScanIsbn },
  name: "BookForm",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    valid: {
      type: Boolean,
      default: () => false,
    },
    readonly: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props) {
    const internalInstance = getCurrentInstance();

    const data = computed({
      get(): Record<string, unknown> {
        return props.modelValue;
      },
      set(data: Record<string, unknown>) {
        internalInstance!.emit("update:modelValue", data);
      },
    });

    const { result } = useQuery(allBookISBN);
    const humanize = (s: string) => s.replace("_", " ");
    const { mutate: getBookData } = useMutation(getBookDataMutation);

    return {
      data,
      result,
      fields,
      humanize,
      error,
      getBookData,
    };
  },
  data: () => ({
    scanning: false,
  }),
  computed: {
    isbnDuplicate(): boolean {
      if (!this.result || !this.data) {
        return false;
      }
      return find(this.result.books, (book) => book.isbn === this.data.isbn);
    },
    hasScanningCapability(): boolean {
      return !!window.MediaDevices;
    },
  },
  watch: {
    isbnDuplicate() {
      this.$emit("update:valid", !this.isbnDuplicate);
    },
  },
  methods: {
    async onISBNChange(isbn: string) {
      if (this.readonly) {
        return;
      }
      try {
        const res = await this.getBookData({ isbn });
        Object.assign(this.data, res.data.getBookData);
      } catch (e) {
        console.error(e);
        this.error = "Could not find ISBN";
      }
    },
  },
});
</script>
<template>
  <template v-if="scanning">
    <scan-isbn
      @isbn="
        onISBNChange($event);
        scanning = false;
      "
      @cancel="scanning = false"
    ></scan-isbn>
  </template>
  <template v-else>
    <div class="flex content-center justify-between items-center space-x-4">
      <div
        class="flex flex-col items-stretch text-left py-1 capitalize flex-grow"
      >
        <label id="isbn">ISBN</label>
        <input
          v-model="data['isbn']"
          type="number"
          for="isbn"
          :readonly="readonly"
          @blur="onISBNChange(data.isbn)"
        />
      </div>

      <ion-icon
        v-if="!readonly && hasScanningCapability"
        name="camera"
        size="large"
        class="mr-2"
        @click="scanning = true"
      ></ion-icon>
    </div>

    <p v-if="!readonly && isbnDuplicate" class="mt- text-red-500">
      ISBN has already been added to library
    </p>
    <div
      v-for="(field, key) in fields"
      :key="key"
      class="flex flex-col items-stretch text-left py-1 capitalize"
    >
      <template v-if="field.type.name === 'bytea'">
        <label :id="field.name">{{ humanize(field.name) }}</label>
        <input type="file" :for="field.name" :readonly="readonly" />
      </template>
      <template
        v-else-if="field.type.ofType && field.type.ofType.name === 'Int'"
      >
        <label :id="field.name">{{ humanize(field.name) }}</label>
        <input
          v-model="data[field.name]"
          type="number"
          :for="field.name"
          :readonly="readonly"
        />
      </template>
      <template v-else>
        <label :id="field.name">{{ humanize(field.name) }}</label>
        <input
          v-model="data[field.name]"
          type="text"
          :for="field.name"
          :readonly="readonly"
        />
      </template>
    </div>
  </template>
</template>
<style lang="postcss" scoped>
input {
  @apply border p-2;
}
</style>
