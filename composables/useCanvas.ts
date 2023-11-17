import type { Picker } from "~/scene/Components/Picker"
import type { CanvasNode } from "~/scene/utils/types"

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

export const usePick = (ctx: CanvasNode) => {
    const picker = usePicker()

    function useHover(id: number) {
        const hover = picker.useHover(id)

        function stop() {
            picker.hoverHandler.remove(id)
        }

        ctx.onDestroy(() => stop())

        return { hover, stop }
    }

    function onClick(id: number, callback: () => void) {
        picker.onClick(id, callback)
        function stop() {
            picker.clickHandler.remove(id)
        }

        ctx.onDestroy(() => stop())

        return { stop }
    }

    return {
        useHover,
        onClick
    }
}