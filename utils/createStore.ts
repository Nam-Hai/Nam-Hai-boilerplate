export function createStore<T>(store: ()=>T){
  const s = store()
  return () => s
}

