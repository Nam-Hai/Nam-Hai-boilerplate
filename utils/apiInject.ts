import { inject, provide } from 'vue';

/**
 * Helper function around provide/inject to create a typed pair with a curried "key" and default values
 */
export function createContext<Args, Values extends Record<string | number | symbol, any>>(
  defaultValue: (args: Args) => Values,
) {

  const key = Symbol()
  const provideContext = (value: Args): any => {
    const defaultVal = defaultValue(value);
    const constructedVal = Object.assign(defaultVal, value)
    provide(key, constructedVal);
    return constructedVal
  };

  const useContext = (value?: Values | (() => Values), treatDefaultAsFactory?: boolean): Values => {
    return inject(key) as Values
  }

  return [provideContext, useContext, key] as const;
}
