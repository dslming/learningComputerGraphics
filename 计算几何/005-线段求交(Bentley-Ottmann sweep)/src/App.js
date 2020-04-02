import { findIntersections } from './algorithm/findIntersections.js'

export default class App {
  constructor() {
    var segments = [
      [[-1, 0], [1, 0]],
      [[0, 1], [0, -1]]
    ]

    console.error(findIntersections(segments));
  }
}


window.onload = () => {
  new App()
}

