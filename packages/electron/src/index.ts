import path from 'path'
import { env } from 'process'
import { existsSync, mkdirSync } from 'original-fs'
import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import webviewAPIServer, { sendToClient } from './webviewAPI.js'
import DanmakuReceiver from './danmakuReceiver.js'
import { getUserAvater } from './utils/getUserAvater.js'

const danmakuReceiver = new DanmakuReceiver()


async function main() {
    if (!existsSync('./static/cache')) {
        mkdirSync('./static/cache/', {
            recursive: true
        })
    }
    await app.whenReady()
    const win = new BrowserWindow({
        width: 700,
        height: 840,
        maximizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.setMenu(Menu.buildFromTemplate([]))
    if (env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        win.loadFile('./dist/UI/index.html')
        win.webContents.on('before-input-event', (event, input) => {
            if (input.alt && input.shift && input.control && input.key === 'F12') {
                win.webContents.openDevTools()
            }
        })
    }

    danmakuReceiver.on('connected', () => {
        win.webContents.send('connected')
    })
    danmakuReceiver.on('close', () => {
        win.webContents.send('close')
    })
    ipcMain.on('connect', (_event, room: number) => {
        danmakuReceiver.connect(room)
    })

    ipcMain.on('disconnect', (_event) => {
        danmakuReceiver.close()
    })

    danmakuReceiver.on('DANMU_MSG', (data: Array<any>) => {
        getUserAvater(data[2][0]).then((face) => {
            win.webContents.send('danmaku', data[2][1], data[1], face, data[3][1], data[3][0])
            sendToClient({
                msg: 'danmaku',
                data: { uname: data[2][1], face, text: data[1], medalName: data[3][1], medalLevel: data[3][0] }
            })
        }).catch(() => {
            win.webContents.send('danmaku', data[2][1], data[1], null, data[3][1], data[3][0])
            sendToClient({
                msg: 'danmaku',
                data: { uname: data[2][1], face: null, text: data[1] }
            })
        })
    })
    danmakuReceiver.on('SEND_GIFT', (data: any) => {
        const { uname, giftName, num, price, super_gift_num } = data
        win.webContents.send('gift', uname, giftName, num, price, super_gift_num)
        sendToClient({
            msg: 'gift',
            data: { uname, giftName, num, price: super_gift_num === 0 ? 0 : num * price / 1000 }
        })
    })
    danmakuReceiver.on('GUARD_BUY', (data: any) => {
        const { uname, gift_name, num } = data
        getUserAvater(data.uid).then((face) => {

            win.webContents.send('guard', uname, gift_name, num, face)
            sendToClient({
                msg: 'guard',
                data: { uname, gift_name, face }
            })
        }).catch(() => {
            win.webContents.send('guard', uname, gift_name, num, null)
            sendToClient({
                msg: 'guard',
                data: { uname, gift_name, face: null }
            })
        })
    })
    danmakuReceiver.on('SUPER_CHAT_MESSAGE', (data: any) => {
        const { uname } = data.user_info
        const { message, price } = data
        const { medal_name, medal_level } = data.medal_info
        getUserAvater(data.user_info.uid).then((face) => {
            win.webContents.send('superchat', uname, message, face, price, medal_level, medal_name)
            sendToClient({
                msg: 'superchat',
                data: { uname, message, face, price, medal_level, medal_name }
            })
        }).catch(() => {
            win.webContents.send('superchat', uname, message, null, price, medal_level, medal_name)
            sendToClient({
                msg: 'superchat',
                data: { uname, message, face: null, price, medal_level, medal_name }
            })
        })
    })
    webviewAPIServer.listen(4351)
}

main().then().catch(e => {
    console.error(e)
})
