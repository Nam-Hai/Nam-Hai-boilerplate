import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';

/**
 * Helper function around provide/inject to create a typed pair with a curried "key" and default values
 */
// export function createContext<T extends string | number | symbol, R>(
export function createContext<A extends string | number | symbol, B, T extends Record<A, B>>(
  defaultValue: () => T,
) {
  const key = Symbol() as InjectionKey<T>

  const provideContext = (value?: Partial<T>): T => {
    const defaultVal = defaultValue();
    const constructedVal = Object.assign(defaultVal, value)
    provide(key, constructedVal);
    return constructedVal
  };

  const useContext = (value?: T | (() => T), treatDefaultAsFactory?: boolean): T => {
    console.log(key);
    if (!value) return inject(key) as T
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return inject(key, value, treatDefaultAsFactory as any) as T;
  }

  return [provideContext, useContext, key] as const;
}
