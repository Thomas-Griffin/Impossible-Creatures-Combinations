import {ref} from 'vue'

let baseURL = 'http://localhost:3000'
const axios = require('axios');


export function useMods() {

  let mods = ref([])
  const modsError = ref(null)

  if (process.env.NODE_ENV === 'production') {
    baseURL = process.env.API_URL
  }

  const getMods = async () => {
    await axios.get(baseURL + '/mods')
      .then((res) => mods.value = res.data)
      .catch((err) => (modsError.value = err))
    return mods.value
  }

  const getModFromDisplayString = (modString) => {
    return mods.value.find(mod => `${mod.name} ${mod?.version}` === modString)
  }

  const getModDisplayName = (mod) => {
    return `${mod.name} ${mod.version}`
  }

  return {getMods, getModFromDisplayString, getModDisplayName}
}





