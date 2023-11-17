// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: false,

    nitro: {
        preset: "vercel",
    },
    css: ["@/styles/core.scss", "@/styles/app/index.scss"],
    modules: ['@pinia/nuxt'],
    pinia: {
        storesDirs: ['./stores/**'],
    },

    components: {
        global: true,
        dirs: [
            "~/components/lib/",
            "~/components/app/",
        ],
    },

    ignore: [
        '~/pages/ignore/',
        '~/pages/ignore/_templatePage.transitions.ts',
    ],

    app: {
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
                // {
                //     rel: "icon",
                //     type: "image/png",
                //     sizes: "16x16x",
                //     href: "/favicon/favicon-16x16.png",
                //     class: "dark",
                // },
                // {
                //     rel: "icon",
                //     type: "image/png",
                //     sizes: "32x32",
                //     href: "/favicon/favicon-32x32_light.png",
                //     class: "light",
                // },
                // {
                //     rel: "icon",
                //     type: "image/png",
                //     sizes: "16x16x",
                //     href: "/favicon/favicon-16x16_light.png",
                //     class: "light",
                // },
                // {
                //     rel: "apple-touch-icon",
                //     sizes: "180x180",
                //     href: "/favicon/apple-touch-icon.png"
                // },
                // {
                //     rel: "mask-icon",
                //     href: "/favicon/safari-pinned-tab.svg",
                //     color: "#292929"
                // }
            ],
            script: [
                {
                    src: "/init.js",
                },
            ],
        },
    },
});
