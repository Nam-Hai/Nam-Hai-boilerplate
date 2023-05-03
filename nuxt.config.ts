// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,

    css: [
        // '@/styles/shared.scss',
        '@/styles/core.scss',
        '@/styles/app/index.scss'
    ],

    modules: ["@nuxtjs/prismic"],
    buildModules: [
        '@nuxtjs/prismic',
    ],

    prismic: {
        endpoint: 'https://testtnuxt.cdn.prismic.io/api/v2',
        // modern: true
        // see documentation for more!
    }
})