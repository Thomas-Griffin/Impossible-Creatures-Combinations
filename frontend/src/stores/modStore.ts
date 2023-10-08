import { defineStore } from 'pinia';
import { UnwrapRef } from 'vue';
import { useMods } from 'src/composables/useMods';

const { getMods } = useMods();

export const useModStore = defineStore('mod', {
  state: () => {
    return {
      mod: {
        name: '',
        version: '',
        columns: [],
      },
    };
  },
  getters: {
    getMod(
      state: UnwrapRef<{
        mod: { name: string; version: string; columns: Array<object> };
      }>,
    ) {
      return state.mod;
    },
  },
  actions: {
    setMod(
      mod: UnwrapRef<{ name: string; version: string; columns: Array<object> }>,
    ) {
      this.$state.mod = mod;
    },

    async getInitialMod() {
      const mods = await getMods();
      this.$state.mod = mods[0];
    },
  },
});
