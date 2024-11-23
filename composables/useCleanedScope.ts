import { onWatcherCleanup, getCurrentWatcher } from "vue"

export const useCleanScope = (callback: (() => (() => void) | void), detached = false) => {
    const curScope = getCurrentScope(), currentWatcher = getCurrentWatcher(), curInstance = getCurrentInstance()

    if (!detached && !curScope && !currentWatcher && !curInstance) throw "useCleanScope is outside a scope or watcher"

    const scope = effectScope(detached);
    scope.run(() => {
        const onDiposeCallback = callback();

        onScopeDispose(() => {
            onDiposeCallback?.();
        });
    });

    if (!!currentWatcher) {
        onWatcherCleanup(() => {
            scope.stop()
        })
    }

    return scope;
};
