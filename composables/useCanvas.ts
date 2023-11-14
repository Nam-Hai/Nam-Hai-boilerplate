import type { Picker } from "~/scene/Components/Picker"

export function useCanvas() {
    const { $canvas } = useNuxtApp()
    return $canvas
}

const canvasRecord = new Map()


// TODO : 
// could be cool to have the key/value be destroy on .destroy
function canvasInject<T>(key: string, defaultValue?: T) {
    function provider(value: T) {
        canvasRecord.set(key, value)

        return () => canvasRecord.delete(key)
    }

    function use(): T {
        return canvasRecord.has(key) ? canvasRecord.get(key) : defaultValue
    }

    return [provider, use] as const
}

// exemple of "props drilling"
export const [providerPicker, usePicker] = canvasInject<Picker>('picker')