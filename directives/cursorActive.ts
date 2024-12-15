const toggleMouse = (active: boolean) => {
}

export const vCursorActive = {
    mounted: (el: HTMLElement) => {
        el.addEventListener("mouseenter", () => toggleMouse(true))
        el.addEventListener("mouseleave", () => toggleMouse(false))
    },
    unmounted: (el: HTMLElement) => {
        el.removeEventListener("mouseenter", () => toggleMouse(true))
        el.removeEventListener("mouseleave", () => toggleMouse(false))
    }
}