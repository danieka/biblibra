<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'Loader',
})
</script>
<template>
    <div class="fixed top-0 left-0 h-screen w-screen bg-opacity-80 bg-black z-20 flex justify-center items-center">
        <h1 class="text-lg text-gray-50 font-bold">Loading</h1>
    </div>
</template>
