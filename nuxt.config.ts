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

    modules: [
        "@nuxtjs/prismic",
    ],
    prismic: {
        endpoint: 'https://testtnuxt.cdn.prismic.io/api/v2',
        configClient: {
            routes: [
                {
                    type: 'article',
                    path: '/article/:uid'
                }
            ]
        }

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
