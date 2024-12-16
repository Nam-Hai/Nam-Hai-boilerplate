
export function createStore<T>(store: () => T) {
  const s = store()
  return () => s
}

const ApiMap = new Map()

function createApi<T>(store: () => T) {
  const key = Symbol()

  const provide = () => {

  }
  const inject = provide()
  return [provide, inject]
}


const useStore = createStore(() => {
  const a = ref(2)
  return {
    a
  }
})