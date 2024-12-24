import { onWatcherCleanup, getCurrentWatcher } from "vue"

export const useCleanScope = (callback: (() => void), options?: { watchCleanup?: boolean, detached?: boolean }) => {
    const currentScope = getCurrentScope(), currentWatcher = getCurrentWatcher(), currentInstance = getCurrentInstance(), isVue = !!currentInstance
    const detached = options?.detached ?? false
    const watchCleanup = options?.watchCleanup ?? true
    if (!detached && !currentScope && !currentWatcher && !currentInstance) throw "useCleanScope is outside a scope or watcher"

    const scope = effectScope(detached);

    if (!!currentWatcher && watchCleanup) {
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
