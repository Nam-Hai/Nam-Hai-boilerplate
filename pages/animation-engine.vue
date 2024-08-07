<template>
    <main ref="mainRef">
        <div class="wrapper">
            <div class="a_w">
                <div>#1</div>
                <div>#2</div>
                <div>#3</div>
            </div>

            <h1 ref="animeRef">ANIMATION</h1>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { usePageFlow } from '~/waterflow/composables/usePageFlow';

const mainRef = shallowRef()
const animeRef = shallowRef()

function anime() {

}

usePageFlow({
    props: {
        mainRef,
        animeRef
    },
    flowIn: (props, res) => {
        const film = useFilm()
        film.from({
            el: mainRef.value,
            p: {
                x: [100, 0]
            },
            d: 1000,
            e: "o2"
        })
        film.from({
            el: props.animeRef.value,
            p: {
                r: [360, 0, "deg"]
            },
            d: 2000,
            e: "o2",
            cb() {
                res()
            },
        })

        film.play()
    },
    flowOut: (props, res) => {
        res()
    }
})

</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

main {
    font-size: 2rem;

    background: red;

    .wrapper {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;

        .a_w {
            display: flex;
        }
    }

    h1 {
        font-size: 9.6rem;
    }
}
</style>
