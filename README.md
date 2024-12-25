# Nam Hai Boilerplate

Everything you'll ever need to build powerfull website.

Nuxt + CustomRenderer for OGL in Vue Component + [Waterflow](https://github.com/Nam-Hai/Waterflow) + Frame engine + Bun/Prisma backend

```
bun i
bun --bun run dev
```

```
cd ./server.bun
bun i
bun run server.ts
```

TODO :

- Base
  - [ ] Maybe switch on an actualy animation lib : gsap/animejs
  - [ ] Refining the Resize engine
  - [ ] plugging effectScope() where needed in my composables
  - [ ] Rework my core.scss
- WebGLRenderer
  - [ ] Router Component
  - [ ] Refining the overall DX
  - [ ] Refining PostProcessing Pipeline
- Bun Backend
  - [ ] add queryParams to routes // no idea
  - [x] format compiled types
