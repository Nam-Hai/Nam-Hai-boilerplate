<template>
    <div class="wrapper">
        <div v-for="i in 20">
            22
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.wrapper > div {
    height: 20rem;
    width: 100vw;
}
div:nth-child(4n){
    background-color: aquamarine;
}
div:nth-child(4n + 1){
    background-color: blue;
}
div:nth-child(4n + 3){
    background-color: red;
}
div:nth-child(4n + 2){
    background-color: black;
}
</style>