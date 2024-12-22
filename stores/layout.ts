import { defineStore } from "pinia";

export interface ILayoutState {
    theme: "light" | "dark" | null;
    preloaderOver: true | false;
}

export const useLayoutStore = defineStore("layoutStore", {
    state: () =>
        ({
            theme: null,
            sectionTheme: null,
            preloaderOver: false,
        }) as ILayoutState,
    actions: {
        setTheme(value: ILayoutState["theme"]) {
            this.theme = value;
        },
        setPreloaderOver(bool: boolean) {
            this.preloaderOver = bool;
        },
    },
});

