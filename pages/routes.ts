import { DefineComponent } from 'nuxt/dist/app/compat/capi';
import index  from './index.vue';
import parallax from './parallax.vue';

const routes = new Map<string, DefineComponent<{},{},any>>();


routes.set('/',  index)
routes.set('/parallax', parallax)

export default routes
