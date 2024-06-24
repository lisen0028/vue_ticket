// src/plugins/persistedState.js
export function createPersistedStatePlugin(key) {
    return (context) => {
        const store = context.store
        const savedState = localStorage.getItem(key)
        if (savedState) {
            store.$patch(JSON.parse(savedState))
        }

        store.$subscribe((mutation, state) => {
            localStorage.setItem(key, JSON.stringify(state))
        })
    }
}
