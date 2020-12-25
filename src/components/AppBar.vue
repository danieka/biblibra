<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'AppBar',
})
</script>
<template>
    <div class="bg-pink-900 p-2 relative h-8 flex justify-end items-center">
        <h1 class="text-center text-white font-bold text-sm whitespace-nowrap overflow-ellipsis overflow-hidden">
            <slot></slot>
        </h1>
        <slot name="button"></slot>
    </div>
</template>
<style lang="postcss" scoped>
h1 {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: calc(100% - 8em);
}
</style>
