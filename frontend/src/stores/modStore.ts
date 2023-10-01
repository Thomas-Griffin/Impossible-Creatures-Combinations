import {defineStore} from 'pinia';
import {UnwrapRef} from 'vue';

export const useModStore = defineStore('mod', {
    state: () => ({
        mod: {
            name: 'Impossible Creatures', version: '1.1', columns: [{
                label: 'Animal 1', type: 'string'
            }, {
                label: 'Animal 2', type: 'string'
            }, {
                label: 'Research Level', type: 'integer'
            }, {
                label: 'Coal', type: 'float'
            }, {
                label: 'Electricity', type: 'float'
            }, {
                label: 'Health', type: 'float'
            }, {
                label: 'EHP', type: 'generated'
            }, {
                label: 'Size', type: 'float'
            }, {
                label: 'Population Size', type: 'float'
            }, {
                label: 'Melee Damage', type: 'float'
            }, {
                label: 'Defence', type: 'percentage'
            }, {
                label: 'Air Speed', type: 'float'
            }, {
                label: 'Land Speed', type: 'float'
            }, {
                label: 'Water Speed', type: 'float'
            }, {
                label: 'Sight Radius', type: 'float'
            }, {
                label: 'Front Legs', type: 'string'
            }, {
                label: 'Rear Legs', type: 'string'
            }, {
                label: 'Head', type: 'string'
            }, {
                label: 'Tail', type: 'string'
            }, {
                label: 'Torso', type: 'string'
            }, {
                label: 'Pincers', type: 'string'
            }, {
                label: 'Wings', type: 'string'
            }, {
                label: 'Abilities', type: 'array'
            }]
        }
    }), getters: {
        getMod(state: UnwrapRef<{ mod: { name: string; version: string, columns: Array<object> } }>) {
            return state.mod;
        }
    }, actions: {
        setMod(mod: UnwrapRef<{ name: string; version: string, columns: Array<object> }>) {
            this.$state.mod = mod;
        }
    },
});




