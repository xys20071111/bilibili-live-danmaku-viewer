<template>
    <div class="danmaku">
        <img class="avatar" :src="props.face" :alt="props.nickname">
        <span class="nickname">{{ props.nickname }}</span>
        <medal class="medal" v-if="medalName" :medal-name="props.medalName" :medal-level="props.medalLevel"/><br/>
        <span>{{ props.text }}</span>
    </div>
</template>

<script setup lang="ts">
import medal from './Medal.vue';
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
    text: {
        type: String,
        required: true
    },
    medalName: {
        type: String,
        required: false
    },
    medalLevel: {
        type: Number,
        required: false
    },
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
}
.nickname {
    padding: 5px;
}
.danmaku {
    border: solid 1px;
    border-radius: 10px;
}
</style>