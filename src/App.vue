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
  <div class="p-2 pb-4 bg-gray-50 w-screen min-height">
    <router-view></router-view>
  </div>
  <toast></toast>
</template>
<style scoped>
div.min-height {
  min-height: 100vh;
}
</style>
