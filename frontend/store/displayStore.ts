import {defineStore} from 'pinia';

export const useDisplayStore = defineStore('display', {
    state: () => ({
        darkMode: true
    }),
    getters: {
        getDarkMode(state) {
            return state.darkMode;
        },
    },
    actions: {
        setDarkMode(darkMode: boolean) {
            this.$state.darkMode = darkMode;
        },
    },
});
