import http from 'http'
import express from 'express'
import websocket from 'ws'

const staticFile = express()
const server = http.createServer(staticFile)
const danmakuEventWebsocket = new websocket.Server({ server, path: '/event' })

staticFile.use(express.static('./static'))

function sendToClient(msg: any) {
    danmakuEventWebsocket.clients.forEach(client => {
        client.send(JSON.stringify(msg))
    })
}

export default server

export { server, danmakuEventWebsocket, sendToClient }