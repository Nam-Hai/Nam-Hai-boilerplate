// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    compatibilityDate: "2024-11-23",
    ssr: true,
    pages: true,
    devtools: { enabled: true },
    devServer: {
        host: "0.0.0.0",
    },
    css: ["@/styles/core.scss"],

    app: {
        layoutTransition: false,
        head: {
            meta: [
                {
                    name: "viewport",
                    content:
                        "width=device-width initial-scale=1 maximum-scale=1.2 user-scalable=no",
                },
                {
                    charset: "utf-8",
                },
                {
                    name: "theme-color",
                    content: "#000000",
                },
            ],
            title: "Nam-Hai Boilerplate",
            link: [
                // {
                //     rel: "preload",
                //     //   href: '/fonts/founders-grotesk-light.woff2',
                //     href: "/fonts/GT-America-Standard-Regular.ttf",
                //     as: "font",
                //     type: "font/ttf",
                //     crossorigin: "anonymous",
                // },
                // {
                //     rel: "icon",
                //     type: "image/png",
                //     sizes: "32x32",
                //     href: "/favicon/favicon-32x32.png",
                //     class: "dark",
                // },
            ],
        },
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "~/styles/_shared.scss" as *;',
                    api: "modern-compiler",
                    quietDeps: true,
                    silenceDeprecations: ["mixed-decls"],
                },
            },
        },
    },
    vue: {
        runtimeCompiler: true,
    },
    // routeRules: {
    //     "/": { prerender: true },
    //     "/about": { prerender: true },
    //     "/works": { swr: true },
    //     "/works/**": { swr: 3600 },
    //     "/api/**": { cors: true },
    // },
});