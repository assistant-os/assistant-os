import db from './db'

export default class Collection {
  constructor(name, initState) {
    this.name = name
    this.initState = initState
  }

  async start() {
    if (
      db() &&
      !db()
        .has(this.name)
        .value()
    ) {
      db()
        .set(this.name, this.initState)
        .write()
    }
  }

  async append(entry) {
    db()
      .get(this.name)
      .push(entry)
      .write()
  }
}
