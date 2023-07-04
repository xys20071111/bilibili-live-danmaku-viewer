<template>
    <div :class="{ 'alert-info': info,  'alert-warn': warn}">
        <span>{{ props.text }}</span>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
    type: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
})
const info = ref(false)
const warn = ref(false)
if(props.type === 'info') {
    info.value = true
    warn.value = false
} else {
    warn.value = true
    info.value = false
}
</script>

<style scoped>
.alert-info {
    background-color: rgb(16, 131, 5);
}
.alert-warning {
    background-color: rgb(119, 5, 5);
}
</style>