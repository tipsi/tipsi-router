export default class RouterBase {
  constructor() {
    this.title = ''
    this.observers = []
  }

  subscribe(fn) {
    this.observers.push(fn)
  }

  unsubscribe(fn) {
    this.observers = this.observers.filter(subscriber => subscriber !== fn)
  }

  broadcast(data) {
    this.observers.forEach(subscriber => subscriber(data))
  }

  setTitle(title) {
    this.title = `${title}`.trim()
    this.broadcast(this.title)
  }

  config = () => {}

  getCurrentRoute = () => {}

  getCurrentQuery = () => {}
}
