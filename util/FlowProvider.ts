import type { RouteLocationNormalized } from 'vue-router';
import { createContext } from "~/util/apiInject";
import { DefineComponent, ShallowRef } from 'nuxt/dist/app/compat/capi';

export type FlowProps = Record<string, any>

export class FlowProvider {
  // public transitionOut!: Promise<void>;
  public flowHijacked!: Promise<void>;
  private flowHijackResolver?: () => void;
  private routeTo!: RouteLocationNormalized;
  private routeFrom!: RouteLocationNormalized;
  bufferRouteState?: ShallowRef;
  props: FlowProps = {}
  flowIsHijacked: boolean = false;

  routerMap: Map<string, DefineComponent<{}, {}, any>>

  constructor(route: RouteLocationNormalized) {
    this.routeTo = route
    this.routeFrom = route

    this.routerMap = new Map()
  }

  registerPage(path: string, pageComponent: DefineComponent<{}, {}, any>) {
    this.routerMap.set(path, pageComponent)
    console.log(this.routerMap)
  }

  // connect the BufferPage in the Layout for crossfade animations
  public connectBuffer(bufferRouteState: ShallowRef) {
    this.bufferRouteState = bufferRouteState
  }

  // to add global props, like layout component or a webGL context
  public addProps(key: string, prop: Ref<any>) {
    if (!this.props[key]) {
      this.props[key] = prop
    }
  }

  public unMountBufferPage() {
    this.bufferRouteState && (this.bufferRouteState.value = undefined)
  }

  public onChangeRoute(routeTo: RouteLocationNormalized) {
    this.routeFrom = this.routeTo
    this.routeTo = routeTo
  }

  public triggerCrossfade() {
    this.bufferRouteState && (this.bufferRouteState.value = this.routerMap.get(this.routeTo.path));
    return !!this.bufferRouteState?.value
  }

  public getRouteFrom(): RouteLocationNormalized {
    return this.routeTo;
  }

  public getRouteTo(): RouteLocationNormalized {
    return this.routeFrom;
  }

  public releaseHijackFlow(): void {
    if (this.flowHijackResolver) {
      this.flowHijackResolver();
      this.flowIsHijacked = false
      this.flowHijackResolver = undefined
    }
  }

  public hijackFlow() {
    this.flowIsHijacked = true
    this.flowHijacked = new Promise<void>((resolve) => {
      this.flowHijackResolver = resolve;
    });
    return this.flowHijacked
  }
}

export const [provideFlowProvider, useFlowProvider] = createContext<FlowProvider>('flow-provider');
