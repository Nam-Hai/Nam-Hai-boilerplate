import { defineStore } from "pinia";

export interface ILayoutState {
    theme: "light" | "dark" | null;
    sectionTheme: "light" | "dark" | null;
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
        setSectionTheme(value: ILayoutState["theme"]) {
            this.sectionTheme = value;
        },
        setPreloaderOver(bool: boolean) {
            this.preloaderOver = bool;
        },
    },
});

