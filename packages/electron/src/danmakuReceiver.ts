/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable class-methods-use-this */
import { COOKIES, UID } from './constant'
import { WebSocket } from 'ws'
import * as https from 'https'
import { EventEmitter } from 'events'
import * as zlib from 'zlib'

enum DANMAKU_PROTOCOL {
	JSON = 0,
	HEARTBEAT,
	ZIP,
	BROTLI
}

enum DANMAKU_TYPE {
	HEARTBEAT = 2,
	HEARTBEAT_REPLY = 3,
	DATA = 5,
	AUTH = 7,
	AUTH_REPLY = 8
}

class DanmakuReceiver extends EventEmitter {
	private socket?: WebSocket
	constructor() {
		super()
	}

	public async connect(roomId: number) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			return
		}
		console.log(`[弹幕接收器]房间: ${roomId}`)
		// 请求弹幕服务器地址
		const request = https.request(`https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=${roomId}&type=0`, {
			method: 'GET',
			headers: {
				'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
				host: 'api.live.bilibili.com',
				cookie: COOKIES
			},
		})
		request.on('response', (response) => {
			if (response.statusCode !== 200) {
				response.resume()
				throw new Error(`Error, code:${response.statusCode}`)
			}
			response.setEncoding('utf8')
			let rawData = ''
			response.on('data', (chunk) => { rawData += chunk })
			response.on('end', () => {
				const roomConfig = JSON.parse(rawData)
				// 连接弹幕服务器
				this.socket = new WebSocket(`wss://${roomConfig.data.host_list[0].host}:${roomConfig.data.host_list[0].wss_port}/sub`)
				this.socket.on('message', this.danmakuProcesser.bind(this))
				this.socket.on('close', () => {
					console.log('[弹幕接收器]掉线')
					this.emit('close')
				})
				this.socket.on('error', () => {
					console.log('[弹幕接收器]掉线')
					this.emit('close')
				})
				this.socket.on('open', async () => {
					// 生成并发送验证包
					const data = JSON.stringify({
						roomid: roomId, protover: 3, platform: 'web', uid: UID, key: roomConfig.data.token,
					})
					const authPacket = this.generatePacket(1, 7, data)
					if (this.socket && this.socket.readyState === WebSocket.OPEN) {
						this.socket.send(authPacket)
					} else {
						this.close()
					}
				})
			})
		})
		request.end()
	}

	private generatePacket(protocol: number, type: number, payload: string | Buffer): Buffer {
		const packetLength = 16 + Buffer.byteLength(payload, 'utf-8')
		let packet = Buffer.alloc(packetLength)
		packet.writeInt32BE(packetLength, 0) // 总长度
		packet.writeInt16BE(16, 4) // 头长度
		packet.writeUInt16BE(protocol, 6) // 协议类型
		packet.writeUInt32BE(type, 8) // 包类型
		packet.writeUInt32BE(1, 12) // 一个常数
		if (typeof payload === 'string') {
			packet.write(payload, 16) // 数据体
		} else {
			packet = Buffer.concat([packet, payload])
		}
		return packet
	}

	private danmakuProcesser(msg: Buffer) {
		// 弹幕事件处理
		const packetProtocol = msg.readInt16BE(6)
		const packetType = msg.readInt32BE(8)
		const packetPayload: Buffer = msg.subarray(16)
		switch (packetType) {
			case DANMAKU_TYPE.HEARTBEAT_REPLY:
				// 心跳包，不做处理
				break
			case DANMAKU_TYPE.AUTH_REPLY:
				{
					console.log('[弹幕接收器]验证通过')
					// 认证通过，每30秒发一次心跳包
					const heartbeat = setInterval(() => {
						const heartbeatPayload = '陈睿你妈死了'
						if (this.socket && this.socket.readyState === WebSocket.OPEN) {
							this.socket.send(this.generatePacket(1, 2, heartbeatPayload))
						} else {
							clearInterval(heartbeat)
							this.emit('close')
						}
					}, 30000)
					this.emit('connected')
					break
				}
			case DANMAKU_TYPE.DATA:
				switch (packetProtocol) {
					case DANMAKU_PROTOCOL.JSON:
						{
							// 这些数据大都没用，但还是留着吧
							let jsonData = JSON.parse(packetPayload.toString('utf-8'))
							this.emit(jsonData.cmd, jsonData.data)
							break
						}
					case DANMAKU_PROTOCOL.BROTLI:
						{
							zlib.brotliDecompress(packetPayload, (err, result) => {
								if (err) {
									console.warn(err)
								}
								let offset = 0
								while (offset < result.length) {
									const length = result.readUInt32BE(offset)
									const packetData = result.subarray(offset + 16, offset + length)
									const data = JSON.parse(packetData.toString('utf8'))
									const cmd = data.cmd.split(':')[0]
									this.emit(cmd, (data.info || data.data))
									offset += length
								}
							})
							break
						}
					default:
						break
				}
				break
		}
	}

	public close(): void {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.close()
		}
		this.socket = undefined
		this.emit('close')
	}
}

export default DanmakuReceiver
