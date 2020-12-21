<script lang="ts">
import { defineComponent } from "vue";
import Toast from "./components/Toast.vue";

export default defineComponent({
  components: {
    Toast,
  },
  name: "App",
});
</script>
<template>
  <div class="w-screen min-height bg-gray-100">
    <div class="bg-pink-900 p-2">
      <h1 class="text-center text-white font-bold">
        {{ $route.meta.title }}
      </h1>
    </div>
    <div class="p-2 pb-4">
      <router-view></router-view>
    </div>
    <toast></toast>
  </div>
</template>
<style scoped>
div.min-height {
  min-height: 100vh;
}
</style>
