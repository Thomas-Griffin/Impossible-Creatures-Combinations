import {ref} from 'vue'

import axios from 'axios';
import type Mod from '../types/Mod'

const baseURL = 'http://localhost:3000';

export function useMods() {
    const mods = ref<Mod[]>([]);
    const modsError = ref(null);

    const getMods = async (): Promise<Mod[]> => {
        await axios
            .get(baseURL + '/mods')
            .then(res => (mods.value = res.data))
            .catch(err => (modsError.value = err));
        return mods.value
    };

    const getModFromDisplayString = (modName: string): Mod | undefined => mods.value.find((mod: Mod) => `${mod.name} ${mod?.version}` === modName);

    const getModDisplayName = (mod: Mod) => {
        return `${mod.name} ${mod.version}`
    };

    return {getMods, getModFromDisplayString, getModDisplayName}
}
