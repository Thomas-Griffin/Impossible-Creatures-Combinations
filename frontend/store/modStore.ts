import { defineStore } from "pinia";

import type Mod from "../types/Mod";

export const useModStore = defineStore({
  id: "mod",
  state: () => ({
    mod: { name: "", version: "", columns: [] } as Mod,
  }),
  getters: {
    getMod: (state) => state.mod as Mod,
  },
  actions: {
    setMod(mod: Mod) {
      if (!mod) {
        return;
      }
      this.mod = mod;
    },
  },
});
