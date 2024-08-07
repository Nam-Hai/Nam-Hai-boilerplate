import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';

/**
 * Helper function around provide/inject to create a typed pair with a curried "key" and default values
 */
// export function createContext<T extends string | number | symbol, R>(
export function createContext<Args extends any, A extends string | number | symbol, B, T extends Record<A, B>>(
  k: string,
  defaultValue: (args: Args) => T,
) {

  const key = Symbol()
  const provideContext = (value: Args): T => {
    const defaultVal = defaultValue(value);
    const constructedVal = Object.assign(defaultVal, value)
    provide(key, constructedVal);
    return constructedVal
  };

  const useContext = (value?: T | (() => T), treatDefaultAsFactory?: boolean): T => {
    return inject(key) as T
  }

  return [provideContext, useContext, key] as const;
}
