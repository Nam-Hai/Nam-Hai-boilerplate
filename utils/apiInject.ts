import { inject, provide } from 'vue';

/**
 * Helper function around provide/inject to create a typed pair with a curried "key" and default values
 */
// export function createContext<T extends string | number | symbol, R>(
export function createContext<Args, T extends Record<string | number | symbol, any>, Values = Omit<T, "init">>(
  defaultValue: (args: Args) => T,
) {

  const key = Symbol()
  const provideContext = (value: Args): any => {
    const defaultVal = defaultValue(value);
    const constructedVal = Object.assign(defaultVal, value)
    provide(key, constructedVal);
  };

  const useContext = (value?: Values | (() => Values), treatDefaultAsFactory?: boolean): Values => {
    return inject(key) as Values
  }

  return [provideContext, useContext, key] as const;
}
