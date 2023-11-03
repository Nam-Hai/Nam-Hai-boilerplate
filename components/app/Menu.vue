<template>
  <div class="position__wrapper">
    <div class="glass__wrapper">
      <div class="glass">
        <div class="menu__wrapper" ref="wrapperRef">
          <NuxtLink to="/" class="menu-item button-default-anime">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="8"
              viewBox="0 0 13 8"
              fill="none"
            >
              <path
                d="M4.67985 0.538376C4.06118 0.197037 3.33227 0.0263672 2.49315 0.0263672H1.0376V1.30639V1.31212H1.35193V1.31253L2.52515 1.30639C3.0656 1.30639 3.53139 1.41661 3.92251 1.63706C4.32073 1.85751 4.63007 2.16685 4.85052 2.56508C5.07097 2.96331 5.18119 3.43976 5.18119 3.99444C5.18119 4.542 5.07097 5.01845 4.85052 5.42379C4.63007 5.82202 4.32073 6.13492 3.92251 6.36248C3.53139 6.58292 3.0656 6.69315 2.52515 6.69315L1.0376 6.69316V7.97317L2.49315 7.97317C3.33227 7.97317 4.06118 7.80605 4.67985 7.47183C5.30564 7.13049 5.7892 6.66115 6.13054 6.0638C6.47188 5.45935 6.64255 4.76956 6.64255 3.99444C6.64255 3.2122 6.47188 2.52597 6.13054 1.93573C5.7892 1.33839 5.30564 0.872604 4.67985 0.538376Z"
                fill="#141414"
              />
              <path
                d="M8.75862 0.538376C9.3773 0.197037 10.1062 0.0263672 10.9453 0.0263672H12.4009V1.30639V1.31212H12.0865V1.31253L10.9133 1.30639C10.3729 1.30639 9.90709 1.41661 9.51597 1.63706C9.11774 1.85751 8.8084 2.16685 8.58795 2.56508C8.36751 2.96331 8.25728 3.43976 8.25728 3.99444C8.25728 4.542 8.36751 5.01845 8.58795 5.42379C8.8084 5.82202 9.11774 6.13492 9.51597 6.36248C9.90709 6.58292 10.3729 6.69315 10.9133 6.69315L12.4009 6.69316V7.97317L10.9453 7.97317C10.1062 7.97317 9.3773 7.80605 8.75862 7.47183C8.13284 7.13049 7.64927 6.66115 7.30793 6.0638C6.96659 5.45935 6.79592 4.76956 6.79592 3.99444C6.79592 3.2122 6.96659 2.52597 7.30793 1.93573C7.64927 1.33839 8.13284 0.872604 8.75862 0.538376Z"
                fill="#141414"
              />
              <path
                d="M0.5 3.99658H13"
                stroke="#141414"
                stroke-width="1.04167"
              />
            </svg>
            <span class="button-default-anime"> Delphi </span>
          </NuxtLink>
          <NuxtLink to="/use-cases" class="menu-item button-default-anime">
            Use Cases
          </NuxtLink>
          <NuxtLink to="#" class="menu-item button-default-anime">
            Try Clones
          </NuxtLink>
          <NuxtLink to="#" class="menu-item button-default-anime">
            Log in
          </NuxtLink>
          <NuxtLink
            to="#"
            class="menu-item button-default-anime menu-item-dark"
          >
            Start for free
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="12"
              viewBox="0 0 15 12"
              fill="none"
            >
              <path
                d="M1 6.00006H13.5M13.5 6.00006L9.07904 1.5791M13.5 6.00006L9.07904 10.421"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const store = useStore();

const wrapperRef = ref() as Ref<HTMLElement>;
</script>

<style lang="scss" scoped>
@use "@/styles/shared.scss" as *;

.position__wrapper {
  position: fixed;
  top: 7rem;
  left: 50%;
  z-index: 20;

  .glass__wrapper {
    position: absolute;
    inset: 0;

    .glass {
      position: absolute;
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      -webkit-mask-image: linear-gradient(white 0%, white 100%);
      -webkit-mask-clip: content-box;

      position: absolute;
      // inset: -5rem;
      padding: 5rem;
      background-color: transparent;
      transform: translateX(-50%);

      border-radius: 6.5rem;
      width: max-content;
      height: 15rem;
    }
  }
}

.menu__wrapper {
  display: inline-flex;
  padding: 0.5rem;
  gap: 1rem;
  height: 5rem;

  // border-radius: 1.5rem;
  // background: rgba(255, 255, 255, 0.16);
  // box-shadow: 0px .4rem 2.4rem 0rem rgba(0, 0, 0, 0.08);
  // backdrop-filter: blur(10px);

  // padding: 10rem;
  // inset: -9.5rem;

  color: $text-dark;

  opacity: 0;
  animation: fade-in 1s ease 0.2s forwards;

  .menu-item {
    padding: 1.6rem;
    border-radius: 1.5rem;
    font-size: 1.4rem;
    font-style: normal;
    line-height: 0;
    font-weight: 450;
    letter-spacing: -0.035rem;

    display: flex;
    align-items: center;
    column-gap: 0.3rem;

    &-dark {
      background-color: $text-dark;
      color: white;
      padding-right: 3.7rem;

      svg {
        position: absolute;
        top: 50%;
        transform: translate(8.3rem, -50%);
        height: 1.4rem;
        transition: transform 250ms;
      }

      &:hover svg {
        transform: translate(8.6rem, -50%);
      }
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
</style>
