import { EventEmitter } from 'events'
import { ipcRenderer, contextBridge } from 'electron'

const danmakuEventBus = new EventEmitter()

contextBridge.exposeInMainWorld('control', {
    connect (room: number) {
        ipcRenderer.send('connect', room)
    },
    disconnect () {
        ipcRenderer.send('disconnect')
    },
    danmakuEventBus: {
        on(event: string, listener: (...args: any[]) => void) {
            danmakuEventBus.on(event, listener)
        }
    }
})

ipcRenderer.on('danmaku', (_event, uname, text, face, medalName, medalLevel) => {
    danmakuEventBus.emit('danmaku', uname, text, face, medalName, medalLevel)
})

ipcRenderer.on('gift', (_event, uname, giftName, num, face, price, super_gift_num) => {
    danmakuEventBus.emit('gift', uname, giftName, num, face, price, super_gift_num)
})

ipcRenderer.on('guard', (_event, uname, giftName, num, face) => {
    danmakuEventBus.emit('guard', uname, giftName, num, face)
})

ipcRenderer.on('superchat', (_event, uname, text, face, price) => {
    danmakuEventBus.emit('superchat', uname, text, face, price)
})
