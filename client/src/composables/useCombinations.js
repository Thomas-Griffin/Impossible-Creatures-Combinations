import {ref} from 'vue'

const axios = require('axios');
let baseURL = 'http://localhost:3000'


export function useCombinations() {
  if (process.env.NODE_ENV === 'production') {
    baseURL = process.env.API_URL
  }

  const combinationsError = ref(null)
  const setModError = ref(null)


  const setMod = async (mod) => {
    if (mod?.name && mod?.version) {
      await axios.post(baseURL + '/combinations/set-mod', mod)
        .then(res => {
          if (res.data?.status === 200) {
            setModError.value = null
          } else {
            setModError.value = res.data
          }
        })
        .catch((err) => (combinationsError.value = err))
      return mod
    }
  };

  const getTotalCombinations = async () => {
    let totalCombinations = 0
    await axios.get(`${baseURL}/combinations/total`)
      .then((res) => {
        totalCombinations = res.data
      })
      .catch((err) => (combinationsError.value = err))
    return totalCombinations
  }

  const getCombinations = async (pageNumber, nPerPage) => {
    let combinations = []
    let response = await axios.get(`${baseURL}/combinations?pageNumber=${pageNumber}&nPerPage=${nPerPage}`)
    combinations = response.data
    return combinations
  }

  const getMinMax = async (attribute) => {
    let response = await axios.get(`${baseURL}/combinations/min-max?attribute=${attribute}`)
    return response.data
  }


  return {
    setMod,
    setModError,
    combinationsError,
    getCombinations,
    getTotalCombinations,
    getMinMax
  }
}


