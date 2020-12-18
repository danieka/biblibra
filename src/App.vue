<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>
<template>
  <div class="p-2 bg-gray-50 h-screen w-screen">
    <router-view></router-view>
  </div>
</template>
