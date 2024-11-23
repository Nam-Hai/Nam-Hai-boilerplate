import { onWatcherCleanup, getCurrentWatcher } from "vue"

export const useCleanScope = (callback: () => () => void, detached = false) => {
    const curScope = getCurrentScope(), currentWatcher = getCurrentWatcher(), curInstance = getCurrentInstance()
    const scope = effectScope(detached);

    if (!curScope && !currentWatcher && !curInstance) throw "useCleanScope is outside a scope or watcher"

    scope.run(() => {
        const onDiposeCallback = callback();

        onScopeDispose(() => {
            onDiposeCallback();
        });
    });

    if (!!currentWatcher) {
        onWatcherCleanup(() => {
            scope.stop()
        })
    } else {
        // on peut supprimer, je sais pas dans quel monde on va utiliser un effect()
        // onEffectCleanup(() => {
        //     scope.stop()
        // })
    }

    return scope;
};
