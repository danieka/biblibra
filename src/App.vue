<script lang="ts">
import { defineComponent } from 'vue'
import Toast from './components/Toast.vue'

export default defineComponent({
    components: {
        Toast,
    },
    name: 'App',
})
</script>
<template>
    <div class="w-screen min-height bg-gray-100">
        <router-view></router-view>
        <toast></toast>
    </div>
</template>
<style scoped>
div.min-height {
    min-height: 100vh;
}
</style>
