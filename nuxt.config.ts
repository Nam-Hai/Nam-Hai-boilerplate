// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: true,
    nitro: {
        prerender: {
            crawlLinks: true
        }
    },

    css: [
        '@/styles/core.scss',
        '@/styles/app/index.scss'
    ],
    ignore: [
        'pages/_templatePage.vue',
        'pages/_template.transitions.ts',
    ],
    modules: [
        "@nuxtjs/prismic",
    ],
    prismic: {
        endpoint: 'endpoint',
        // modern: true
        // see documentation for more!
    },
    components: {
        global: true,
        dirs: [
            '~/components/app'
        ]
    },
})
