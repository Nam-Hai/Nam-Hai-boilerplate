import type { RouteLocationNormalized } from 'vue-router';
import {createContext} from "~/util/apiInject";
import { ShallowRef } from 'nuxt/dist/app/compat/capi';
import routes from '~/pages/routes';
import  Canvas  from '@/scene/canvas.js';

export class FlowProvider {
  // public transitionOut!: Promise<void>;
  public flowHijacked!: Promise<void>;
  private flowHijackResolver!: () => void;
  // private readonly body: HTMLElement | null = typeof window !== 'undefined' ? document.body : null;

  private leaveToRoute!: RouteLocationNormalized;
  private leaveFromRoute!: RouteLocationNormalized;
  routePage!: ShallowRef;
  canvas?: Ref<Canvas>

  public connectBuffer(routePage: ShallowRef){
    this.routePage = routePage
  }

  public unMountBufferPage(){
    this.routePage.value = undefined
  }

  public setLeaveToRoute(route: RouteLocationNormalized): void {
    this.leaveToRoute = route;
    this.routePage.value = routes.get(route.path);
  }

  public getLeaveToRoute(): RouteLocationNormalized {
    return this.leaveToRoute;
  }


  public getLeaveFromRoute(): RouteLocationNormalized {
    return this.leaveFromRoute;
  }

  public setLeaveFromRoute(route: RouteLocationNormalized): void {
    this.leaveFromRoute = route;
  }

  public releaseHijackFlow(): void {
    if (this.flowHijackResolver) this.flowHijackResolver();
  }

  public hijackFlow(): void {
    this.flowHijacked = new Promise<void>((resolve) => {
      this.flowHijackResolver = resolve;
    });
  }

  // private disablePointerEvents(disable?: boolean): void {
  //   if (this.body) {
  //     this.body.style.pointerEvents = disable ? 'none' : 'all';
  //   }
  // }

  // private async onFlowComplete(release: () => void): Promise<void> {
  //   release();
  //   this.disablePointerEvents(false);
  // }
}

export const [provideFlowProvider, useFlowProvider] = createContext<FlowProvider>('flow-provider');
