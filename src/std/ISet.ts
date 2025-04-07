function eq(a: any, b: any): boolean {
  if (typeof a !== typeof b) return false
  switch (typeof a) {
    case 'bigint':
    case 'boolean':
    case 'number':
    case 'string':
    case 'function':
    case 'undefined':
      return a === b
    case 'object':
      switch (a.constructor) {
        case Array:
          if (a.length !== b.length) return false
          return (a as Array<any>).every((x: any, i) => eq(x, b[i]))
        case Object:
          if (Object.keys(a).length !== Object.keys(b).length) return false
          for (let key in a) if (!eq(a[key], b[key])) return false
          return true
        default:
          throw 'unknown'
      }
    case 'symbol':
      throw 'unknown'
  }
}

class ISet<T extends { toString(): string }> {
  #set: T[]
  constructor(iterable: Iterable<T> = []) {
    this.#set = Array.from(iterable)
  }
  [Symbol.iterator]() {
    return this.#set[Symbol.iterator]()
  }
  add(...values: T[]) {
    return new ISet([...this, ...values])
  }
  delete(value: T) {
    let self = new Set(this.#set)
    self.delete(value)
    return new ISet(self)
  }
  has(value: T) {
    return this.#set.some((item) => eq(item, value))
  }
  get size() {
    return this.#set.length
  }
  join(separator?: string) {
    return this.#set.join(separator)
  }
  some(predicate: (value: T) => boolean) {
    return this.#set.some(predicate)
  }
}

export default ISet
