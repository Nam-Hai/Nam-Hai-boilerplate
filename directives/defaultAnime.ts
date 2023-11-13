import type { EaseFunctionName } from "~/plugins/core/eases";

export const vDefaultAnime = {
    mounted: (el: HTMLElement, binding: { duration: number, delay: number, x: number, y: number, e: EaseFunctionName }) => {
        const { $TL } = useNuxtApp()
        const d = binding.duration || 1000;
        const delay = binding.delay || 0;
        const x = binding.x || 2;
        const y = binding.y || 0;
        const e = binding.e || 'linear';

        (new $TL).from({
            el,
            d,
            delay,
            e,
            p: {
                o: [0, 1],
                x: [x, 0, 'rem'],
                y: [y, 0, 'rem']
            }
        }).play()
    }
}