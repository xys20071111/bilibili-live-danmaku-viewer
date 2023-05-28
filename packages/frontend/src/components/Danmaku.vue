<template>
    <div class="danmaku">
        <img class="avatar" :src="props.face" :alt="props.nickname">
        <span class="nickname">{{ props.nickname }}</span>
        <span class="medal" v-if="medalName">{{ props.medalName }} | {{ props.medalLevel }}</span><br/>
        <span>{{ props.text }}</span>
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
.medal {
    border: solid;
    border-width: 1px;
    border-color: white;
    border-radius: 5px;
    font-size: 12px;
    color: white;
}

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