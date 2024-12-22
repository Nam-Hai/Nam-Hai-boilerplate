export default defineNuxtRouteMiddleware((to) => {
    const darkThemedRoutes = ["index"];

    const layoutStore = useLayoutStore();

    if (typeof to.name === "string" && darkThemedRoutes.includes(to.name)) {
        layoutStore.setTheme("dark");
    } else {
        layoutStore.setTheme("light");
    }
});
