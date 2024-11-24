import { onWatcherCleanup, getCurrentWatcher, EffectScope, type ShallowRef } from "vue"

export const useCleanScope = <T>(callback: (() => T), detached = false) => {
    const currentScope = getCurrentScope(), currentWatcher = getCurrentWatcher(), currentInstance = getCurrentInstance(), isVue = !!currentInstance
    if (!detached && !currentScope && !currentWatcher && !currentInstance) throw "useCleanScope is outside a scope or watcher"

    const scope = effectScope(detached);

    if (!!currentWatcher) {
        onWatcherCleanup(() => {
            scope.stop()
        })
    }

    if (!!currentInstance && !currentInstance?.isMounted && !currentWatcher) {
        onMounted(() => {
            scope.run(() => {
                callback()
            })
        })
    } else {
        scope.run(() => {
            callback();
        });
    }
    return scope
};
