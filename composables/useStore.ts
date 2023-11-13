import cursorStore from "~/services/CursorService"
import store from "~/services/store"

export default function useStore() {
  return store
}

export function useCursorStore() {
  return cursorStore
}