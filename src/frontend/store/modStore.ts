import {defineStore} from 'pinia'
import Mod from '~types/Mod'

const useModStore = defineStore({
    id: 'mod',
    state: () => ({
        mods: [],
        mod: {} as Mod,
    }),
    getters: {
        getMod: state => state.mod as Mod,
        getMods: state => state.mods as Mod[],
    },
    actions: {
        setMod(mod: Mod) {
            if (!mod) {
                return
            }
            this.mod = mod
        },

        async fetchMods() {
            this.mods = await $fetch(`${process.env.API_URL ?? 'http://localhost:3000'}/mods`)
            this.mod = this.mods[0] as Mod
        },
    },
})
export default useModStore
