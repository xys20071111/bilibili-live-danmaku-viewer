<template>
  <header>
    <label for="roomIdInput">房间号:</label>
    <input id="roomIdInput" type="number" v-model="room" />
    <button @click="connect">连接</button>
    <button @click="disconnect">断开连接</button>
    <span>状态: {{ status }}</span>
  </header>
  <main>
    <div class="left-box">
      <div id="danmakuBox">
        <span class="white-text">弹幕</span>
        <div id="danmaku" class="box" ref="danmakuBox">
          <div v-for="item in danmakus">
            <Danmaku :medal-level="item.medalLevel" :medal-name="item.medalName" :nickname="item.uname" :text="item.text"
              :face="item.face" />
          </div>
        </div>
      </div>
      <div id="superchatBox">
        <span class="white-text">醒目留言</span>
        <div id="superchat" class="box" ref="superchatBox">
          <div v-for="item in superchat">
            <SuperChat :price="item.price" :face="item.face" :msg="item.msg" :nickname="item.uname"
              :medal-level="item.medalLevel" :medal-name="item.medalName" />
          </div>
        </div>
      </div>
    </div>
    <div class="right-box">
      <div id="giftBox">
        <span class="white-text">礼物</span>
        <div class="box" ref="giftBox">
          <div v-for="item in gift">
            <Gift :price="item.price !== 0 ? item.price / 1000 : 0" :nickname="item.uname" :gift-name="item.giftName"
              :gift-count="item.count" />
          </div>
        </div>
      </div>
      <div id="guardBox">
        <span class="white-text">舰长</span>
        <div id="guard" class="box" ref="guardBox">
          <div v-for="item in guard">
            <Guard :nickname="item.uname" :num="item.num" :type="item.type" :face="item.face" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { type Ref, ref, nextTick, onMounted } from 'vue'
import Danmaku from './components/Danmaku.vue'
import Gift from './components/Gift.vue'
import Guard from './components/Guard.vue'
import SuperChat from './components/SuperChat.vue'
const danmakuBox = ref()
const superchatBox = ref()
const giftBox = ref()
const guardBox = ref()
const danmakus: Ref<Array<{
  uname: string
  text: string
  face: string
  medalName: string
  medalLevel: number
}>> = ref([]);
const superchat: Ref<Array<{
  uname: string
  msg: string
  face: string
  price: number
  medalName: string
  medalLevel: number
}>> = ref([]);
const gift: Ref<Array<{
  uname: string
  giftName: string
  price: number
  count: number
}>> = ref([])
const guard: Ref<Array<{
  uname: string
  type: string
  num: number
  face: string
}>> = ref([])
const room = ref(localStorage.getItem('room') || '')
const status = ref('未连接')

function connect() {
  window.localStorage.setItem('room', room.value)
  danmakus.value.length = 0
  superchat.value.length = 0
  gift.value.length = 0
  guard.value.length = 0
  window.control.connect(parseInt(room.value))
}
function disconnect() {
  window.control.disconnect()
}

onMounted(() => {
  window.control.danmakuEventBus.on('connected', () => {
    status.value = "已连接"
  })
  window.control.danmakuEventBus.on('close', () => {
    status.value = '未连接'
  })
  window.control.danmakuEventBus.on('danmaku', (uname: string, text: string, face: string, medalName: string, medalLevel: number) => {
    danmakus.value.push({ uname, text, face: `http://localhost:4351/${face}`, medalLevel, medalName })
    if (danmakus.value.length > 30) {
      danmakus.value.splice(0, 1)
    }
    nextTick(() => {
      danmakuBox.value.scrollTop = danmakuBox.value.scrollHeight
    })
  })

  window.control.danmakuEventBus.on('superchat', (uname: string, msg: string, face: string, price: number, medalLevel: number, medalName: string) => {
    superchat.value.push({ uname, msg, face: `http://localhost:4351/${face}`, price, medalLevel, medalName })
    nextTick(() => {
      superchatBox.value.scrollTop = superchatBox.value.scrollHeight
    })
  })

  window.control.danmakuEventBus.on('guard', (uname: string, type: string, num: number, face: string) => {
    guard.value.push({ uname, type, num, face: `http://localhost:4351/${face}` })
    nextTick(() => {
      guardBox.value.scrollTop = guardBox.value.scrollHeight
    })
  })

  window.control.danmakuEventBus.on('gift', (uname: string, giftName: string, num: number, price: number, super_gift_num: number) => {
    console.log(price)
    gift.value.push({ uname, giftName, count: num, price: super_gift_num === 0 ? 0 : price * num })
    nextTick(() => {
      giftBox.value.scrollTop = giftBox.value.scrollHeight
    })
  })
})

</script>

<style scoped>
main {
  display: flex;
}

.left-box {
  width: 350px;
}

.box {
  overflow-y: scroll;
  min-height: 350px;
  height: 350px;
  scrollbar-width: 2px;
}

.box::-webkit-scrollbar {
  width: 0px;
}

.white-text {
  color: white;
}
</style>