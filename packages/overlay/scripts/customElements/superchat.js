class Superchat extends HTMLElement {
  constructor() {
    super()
    const priceNumber = parseFloat(this.getAttribute('price'))
    const shadow = this.attachShadow({ mode: "closed" })
    const box = document.createElement("div")
    box.classList.add("superchat")
    if(priceNumber <= 50) {
        box.classList.add("blue-background")
    }
    if(priceNumber > 50 && priceNumber < 100) {
        box.classList.add("green-background")
    }
    if(priceNumber >= 100) {
        box.classList.add("red-background")
    }

    const header = document.createElement("div")
    header.classList.add("superchat-header")

    const body = document.createElement("div")

    this.avatar = document.createElement("img")

    this.nickname = document.createElement("span")
    this.nickname.setAttribute('class', 'nickname')

    this.medal = document.createElement("span")
    this.medal.setAttribute('class', 'medal')

    this.price = document.createElement("span")
    this.price.setAttribute('class', 'price')

    const hr = document.createElement("hr")

    this.message = document.createElement("span")
    this.message.setAttribute('class', 'text')

    box.append(header, hr, body)
    header.append(this.avatar, this.nickname, this.medal, this.price)
    body.append(this.message)
    shadow.append(box)

    const style = document.createElement("style")
    fetch('css/superchat.css').then(res => res.text()).then(text => style.textContent = text)
    shadow.append(style)
  }

  connectedCallback() {
    this.avatar.setAttribute('class', 'avatar')
    this.avatar.src = this.getAttribute('face')
    this.avatar.alt = this.getAttribute('nickname')
    this.nickname.innerText = this.getAttribute('nickname')
    if (this.getAttribute('medal-name') !== 'undefined') {
        this.medal.innerText = `${this.getAttribute('medal-name')}|${this.getAttribute('medal-level')}`
    } else {
        this.medal.style.display = 'none'
    }
    this.price.innerText = `${this.getAttribute('price')}元`
    this.message.innerText = this.getAttribute('msg')
  }
}

export default Superchat