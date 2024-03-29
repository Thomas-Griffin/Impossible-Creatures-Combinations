import {defineStore} from 'pinia';
import {useMods} from '~/composables/useMods';
import type Mod from '../types/Mod';

const {getMods} = useMods();

export const useModStore = defineStore({
    id: 'mod',
    state: () => ({
        mod: {name: '', version: ''} as Mod
    }),
    getters: {
        getMod: state => state.mod
    },
    actions: {
        async init() {
            const mods = await getMods();
            this.mod = mods[0] || {name: '', version: ''};
        },
        setMod(mod: Mod) {
            this.mod = mod;
        }
    }
});
