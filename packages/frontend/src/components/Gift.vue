<template>
    <div class="gift">
        {{ props.nickname }} 投喂了{{ props.giftCount }}个{{ props.giftName }}<br/>
        共{{ props.price }}元
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    nickname: String,
    giftName: String,
    giftCount: Number,
    price: Number
})
</script>

<style scoped>
.gift {
    border: solid 2px;
    border-radius: 10px;
}
</style>