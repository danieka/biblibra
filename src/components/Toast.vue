<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export const error = ref("");

watch(error, () =>
  setTimeout(() => {
    error.value = "";
  }, 3000)
);

export default defineComponent({
  setup() {
    return {
      error,
    };
  },
});
</script>
<template>
  <div
    v-if="error.length > 0"
    class="fixed bottom-4 flex justify-center align-center container z-20"
  >
    <div class="bg-red-600 py-4 px-6 text-white font-bold rounded-xl">
      {{ error }}
    </div>
  </div>
</template>
