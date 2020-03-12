export default class UI {
  constructor(event) {
    const btn = document.querySelector(".ui-button button")
    btn.onclick = () => {
      event.dispatch("click")
    }
  }
}
