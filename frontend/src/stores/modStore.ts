import { defineStore } from 'pinia'
import { useMods } from 'src/composables/useMods'
import { Mod } from 'src/types/Mod'

const { getMods } = useMods()

export const useModStore = defineStore({
  id: 'mod',
  state: () => ({
    mod: {
      name: '',
      version: ''
    }
  }),
  getters: {
    getMod: (state: { mod: Mod }) => state.mod
  },
  actions: {
    setMod: (mod: Mod) => {
      useModStore().mod = mod
    },

    async getInitialMod() {
      const mods: Mod[] = await getMods()
      this.setMod(mods[0] || { name: '', version: '' })
    }
  }
})
