import { type RouteLocationNormalized, useRoute } from 'vue-router';
import { type DefineComponent, type Ref, type ShallowRef, nextTick, ref } from 'vue';
import { createContext } from './util/apiInject';

export type FlowProps = Record<string, any>

const preventScroll = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

export class FlowProvider {
  routerMap: Map<string, DefineComponent<{}, {}, any>>
  routeTo: ShallowRef<RouteLocationNormalized>;
  routeFrom: ShallowRef<RouteLocationNormalized | null>;

  constructor() {
    const route = useRoute()
    this.routeTo = shallowRef(route)
    this.routeFrom = shallowRef(null)
    console.log("flow constructor", route.name);

    this.routerMap = new Map()
  }

  public onChangeRoute(routeTo: RouteLocationNormalized) {
    // this.routeFrom.value = this.routeTo.value
    // this.routeTo.value = routeTo
    // console.log(this.routeFrom.value.name, this.routeTo.value.name);
    this.routeFrom.value = routeTo
  }
}

export const [provideFlowProvider, useFlowProvider] = createContext<FlowProvider>('flow-provider');
