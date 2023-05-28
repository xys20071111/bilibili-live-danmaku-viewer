<template>
    <div :class="color">
        <div class="superchat-header">
            <img class="avatar" :src="props.face" :alt="props.nickname">
            <span class="nickname">{{ props.nickname }}</span>
            <span class="medal" v-if="props.medalName">{{ props.medalName }} | {{ props.medalLevel }}</span>
            <span class="price">{{ props.price }}元</span>
        </div>
        <hr>
        <div>
            <span class="text">{{ props.msg }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
    price: {
        type: Number,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    medalName: String,
    medalLevel: Number
})
const color = ref("superchat ")
if(props.price <= 50) {
    color.value += 'blue-background'
}
if(props.price >= 100) {
    color.value += 'red-background'
}
</script>

<style scoped>
.superchat {
    border: solid 1px;
    border-color: white;
    border-radius: 5px;
    color: black;
}

.superchat-body {
    min-height: 50px;
}

.avatar {
    margin: 5px;
    width: 30px;
    height: 30px;
    border-radius: 200px;
    vertical-align: middle;
    position: relative;
    top: 2px;
    left: 3px;
}

.medal {
    position: relative;
    border: solid;
    border-width: 1px;
    border-color: white;
    border-radius: 5px;
    font-size: 12px;
    color: white;
}

.blue-background {
    background-color: #1565c0;
}

.red-background {
    background-color: rgb(255, 89, 89);
}
</style>