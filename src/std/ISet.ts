class ISet<T extends { toString(): string }> {
  #set: Set<T>
  constructor(iterable: Iterable<T> = []) {
    this.#set = new Set(iterable)
  }
  [Symbol.iterator]() {
    return this.#set[Symbol.iterator]()
  }
  add(value: T) {
    return new ISet([...this, value])
  }
  delete(value: T) {
    let self = new Set(this.#set)
    self.delete(value)
    return new ISet(self)
  }
  has(value: T) {
    return this.#set.has(value)
  }
  get size() {
    return this.#set.size
  }
  join(separator: string) {
    let out = ''
    for (let elem of this) {
      out += elem.toString() + separator
    }
    out.slice(0, out.length - separator.length)
    return out
  }
}

export default ISet
