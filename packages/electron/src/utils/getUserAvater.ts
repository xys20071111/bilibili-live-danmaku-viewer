import https from 'https'
import { createHash } from 'crypto'
import { createWriteStream, existsSync } from 'original-fs'

const md5 = createHash('md5')

export function getUserAvater(uid: number): Promise<string> {
    return new Promise((resolve, reject) => {
        if (existsSync('./static/cache/' + uid + '.jpg')) {
            resolve('cache/' + uid + '.jpg')
            return
        }
        const req = https.request(`https://api.bilibili.com/x/web-interface/card?mid=${uid}`, {
            method: 'GET',
            headers: {
                Host: 'api.bilibili.com',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0',
                Accept: 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
                'Referer': 'https://t.bilibili.com/',
                'Origin': 'https://t.bilibili.com',
                'DNT': '1',
                'Connection': 'keep-alive',
            }
        })
        req.on('response', (res) => {
            res.setEncoding('utf-8')
            if (res.statusCode !== 200) {
                res.resume()
                return reject(new Error(res.statusCode?.toString()))
            }
            let raw = ''
            res.on('data', (chunk) => raw += chunk)
            res.on('end', () => {
                const data = JSON.parse(raw)
                if (data.code !== 0) {
                    reject(new Error(data.message))
                }
                if(!data.data.card){
                    reject()
                    return
                }
                const url = data.data.card.face.replace('http:', 'https:')
                console.log(`[缓存头像] ${url}`)
                https.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0',
                        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
                        'Referer': 'https://t.bilibili.com/',
                        'Origin': 'https://t.bilibili.com',
                        'DNT': '1',
                    }
                }, (avaterRes) => {
                    if (avaterRes.statusCode !== 200) {
                        avaterRes.resume()
                        reject(new Error(avaterRes.statusCode?.toString()))
                    }
                    const cacheFile = createWriteStream(`./static/cache/${uid}.jpg`)
                    avaterRes.pipe(cacheFile)
                    avaterRes.on('end', () => {
                        cacheFile.close()
                        resolve('cache/' + uid + '.jpg')
                    })
                })
            })
        })
        req.end()
    })
}
