<template>
    <span class="medal">{{ props.medalName }}|{{ props.medalLevel }}</span>
</template>

<script setup lang="ts">
const props = defineProps({
    medalName: {
        type: String,
        required: false
    },
    medalLevel: {
        type: Number,
        required: false
    }
})
</script>

<style scoped>
.medal {
    border: solid;
    border-width: 1px;
    border-color: white;
    border-radius: 5px;
    font-size: 12px;
    color: white;
}
</style>