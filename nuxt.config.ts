// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    srcDir: 'src/',

    ssr: true,
    css: [
        '@/styles/shared.sass',
        '@/styles/core.sass',
        '@/styles/app/index.sass'
    ],
})
