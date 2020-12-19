<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>
<template>
  <div class="p-2 pb-4 bg-gray-50 w-screen">
    <router-view></router-view>
  </div>
</template>
<style scoped>
div {
  min-height: 100vh;
}
</style>
