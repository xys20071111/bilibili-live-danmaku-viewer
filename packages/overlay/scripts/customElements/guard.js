class Guard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "closed" })
    const box = document.createElement("div")
    box.setAttribute("class", "guard")
    shadow.append(box)
    this.avatar = document.createElement("img")
    this.text = document.createElement("span")
    this.avatar.setAttribute("class", "avatar")
    box.append(this.avatar, this.text)
    const style = document.createElement("style")
    fetch('css/guard.css').then(res => res.text()).then(text => style.textContent = text)
    shadow.append(style)
  }
  connectedCallback() {
    const nickname = this.getAttribute("nickname")
    const face = this.getAttribute("face")
    const num = this.getAttribute("num")
    const type = this.getAttribute("type")
    this.avatar.src = face
    this.avatar.alt = nickname
    this.text.innerText = `${nickname}开通了${num}个月的${type}`
  }
}

export default Guard
