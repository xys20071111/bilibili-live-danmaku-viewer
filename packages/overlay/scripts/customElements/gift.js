class Gift extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: "closed" })
    this.box = document.createElement("div")
    this.box.setAttribute('class', 'gift')
    const style = document.createElement("style")
    fetch('./css/gift.css').then(res => res.text()).then(text => style.textContent = text)
    shadow.append(this.box)
    shadow.append(style)
  }
  connectedCallback() {
    const nickname = this.getAttribute("nickname")
    const price = this.getAttribute("price")
    const giftCount = this.getAttribute("gift-count")
    const giftName = this.getAttribute("gift-name")
    this.box.innerText = `${nickname} 投喂了 ${giftCount}个${giftName} 共${price}元`
  }
}

export default Gift
