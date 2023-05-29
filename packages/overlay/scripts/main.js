import Danmaku from './customElements/danmaku.js'
import Superchat from './customElements/superchat.js'
import Gift from './customElements/gift.js'
import Guard from './customElements/guard.js'

customElements.define('danmaku-element', Danmaku)
customElements.define('superchat-element', Superchat)
customElements.define('gift-element', Gift)
customElements.define('guard-element', Guard)

document.addEventListener('DOMContentLoaded', () => {
  const box = document.querySelector('.box')
  const eventChannel = new WebSocket('ws://localhost:4351/event')
  eventChannel.addEventListener('message', (event) => {
    const { msg, data } = JSON.parse(event.data)
    switch (msg) {
      case 'danmaku': {
        const danmaku = document.createElement('danmaku-element')
        danmaku.setAttribute('face', `/${data.face}`)
        danmaku.setAttribute('nickname', data.uname)
        danmaku.setAttribute('text', data.text)
        danmaku.setAttribute('medal-name', data.medalName)
        danmaku.setAttribute('medal-level', data.medalLevel)
        box.append(danmaku)
        break
      }
      case 'superchat': {
        const superchat = document.createElement('superchat-element')
        superchat.setAttribute('face', `/${data.face}`)
        superchat.setAttribute('nickname', data.uname)
        superchat.setAttribute('msg', data.message)
        superchat.setAttribute('medal-name', data.medalName)
        superchat.setAttribute('medal-level', data.medalLevel)
        superchat.setAttribute('price', data.price)
        box.append(superchat)
        break
      }
      case 'gift': {
        const gift = document.createElement('gift-element')
        gift.setAttribute('nickname', data.uname)
        gift.setAttribute('price', data.price)
        gift.setAttribute('gift-name', data.giftName)
        gift.setAttribute('gift-count', data.num)
        box.append(gift)
        break
      }
      case 'guard': {
        const guard = document.createElement('guard-element')
        guard.setAttribute('nickname', data.uname)
        guard.setAttribute('face', `/${data.face}`)
        guard.setAttribute('num', data.num)
        guard.setAttribute('type', data.gift_name)
        box.append(guard)
        break
      }
    }
    box.scrollTop = box.scrollHeight
  })
})
