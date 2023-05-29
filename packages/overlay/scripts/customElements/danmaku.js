class Danmaku extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'closed' })
    const box = document.createElement('div')
    box.setAttribute('class', 'danmaku')
    this.avatar = document.createElement('img')
    this.nickname = document.createElement('span')
    this.medal = document.createElement('span')
    this.content = document.createElement('span')
    this.avatar.setAttribute('class', 'avatar')
    this.nickname.setAttribute('class', 'nickname')
    this.medal.setAttribute('class', 'medal')
    this.content.setAttribute('class', 'content')
    box.append(this.avatar, this.nickname, this.medal, document.createElement('br'), this.content)
    shadow.append(box)

    const style = document.createElement('style')
    fetch('./css/danmaku.css').then(res => res.text()).then(text => style.textContent = text)
    shadow.append(style)
  }

  connectedCallback() {
    this.avatar.src = this.getAttribute('face')
    this.avatar.alt = this.getAttribute('nickname')
    this.nickname.innerText = this.getAttribute('nickname')
    if (this.getAttribute('medal-name') !== 'undefined') {
      this.medal.innerText = `${this.getAttribute('medal-name')}|${this.getAttribute('medal-level')}`
    } else {
      this.medal.style.display = 'none'
    }
    this.content.innerText = this.getAttribute('text')
  }
}

export default Danmaku