import {defineStore} from 'pinia'

const useDisplayStore = defineStore('display', {
    state: () => ({
        darkMode: true,
    }),
    getters: {
        getDarkMode(state) {
            return state.darkMode
        },
    },
    actions: {
        setDarkMode(darkMode: boolean) {
            this.$state.darkMode = darkMode
        },
    },
})
export default useDisplayStore
