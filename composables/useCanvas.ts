import type { Picker } from "~/scene/Components/Picker"

export function useCanvas() {
    const { $canvas } = useNuxtApp()
    return $canvas
}

const canvasRecord = new Map()

// TODO : 
// Maybe that's not the best way to go
// Might juste create Store/Service
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

// example
export const [providerPicker, usePicker] = canvasInject<Picker>('picker')