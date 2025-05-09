import { defineStore } from "pinia";

export interface ILayoutState {
    theme: "light" | "dark" | null;
    preloaderOver: true | false;
}

export const useLayoutStore = defineStore("layoutStore", () => {
    const theme = ref<ILayoutState["theme"]>(null)

    const preloaderOver = ref<boolean>(false)

    const setTheme = (value: ILayoutState["theme"]) => {
        theme.value = value
    }

    const setPreloaderOver = (bool: boolean) => {
        preloaderOver.value = bool
    }

    console.log("pinia theme", theme.value)
    return {
        theme,
        preloaderOver,
        setTheme,
        setPreloaderOver
    }
})
