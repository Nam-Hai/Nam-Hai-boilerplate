export function createState<State>(getter: () => State) {
  const state = lazySingleton(getter)
  return () => state.value
}


export function lazySingleton<T>(getter: () => T): { value: T } {
  return {
    get value() {
      const value = getter()
      Object.assign(this, "value", value)
      return value
    }
  }
}