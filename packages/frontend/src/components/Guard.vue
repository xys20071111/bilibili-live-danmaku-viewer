<template>
    <div class="guard">
        <img class="avatar" :src="props.face" :alt="props.nickname">
        <span>{{ props.nickname }}开通了{{ props.num }}个月的 {{ props.type }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    face: {
        type: String,
        required: true,
        default () {
            return 'noface.jpg'
        }
    },
    nickname: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    num: Number,
})
</script>

<style scoped>
.avatar {
    padding: 5px;
    width: 35px;
    height: 35px;
    border-radius: 200px;
    vertical-align: middle;
    position: relative;
    top: 2px;
    left: 3px;
}

.guard {
    border: solid 2px;
    border-radius: 10px;
}
</style>