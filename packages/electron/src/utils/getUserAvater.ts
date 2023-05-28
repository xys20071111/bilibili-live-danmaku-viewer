import https from 'https'
import { createHash } from 'crypto'
import { createWriteStream, existsSync, open, openSync, writeFileSync } from 'original-fs'

const md5 = createHash('md5')

export function getUserAvater(uid: number): Promise<string> {
    return new Promise((resolve, reject) => {
        if (existsSync('./static/cache/' + uid + '.jpg')) {
            resolve('cache/' + uid + '.jpg')
        }
        const req = https.request(`https://api.bilibili.com/x/web-interface/card?mid=${uid}`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0',
                'Referer': 'https://www.bilibili.com/',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'cross-site',
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'TE': 'trailers'
            }
        })
        req.on('response', (res) => {
            res.setEncoding('utf-8')
            if (res.statusCode !== 200) {
                return ''
            }
            let raw = ''
            res.on('data', (chunk) => raw += chunk)
            res.on('end', () => {
                const data = JSON.parse(raw)
                if(data.code !== 0) {
                    reject(new Error(data.message))
                }
                https.get(data.data.card.face.replace('http:', 'https:'), (res) => {
                    if(res.statusCode !== 200) {
                        res.resume()
                        return
                    }
                    const cacheFile = createWriteStream(`./static/cache/${uid}.jpg`)
                    res.pipe(cacheFile)
                    res.on('close', () => {
                        resolve(`cache/${uid}.jpg`)
                    })
                })
            })
        })
        req.end()
    })
}
