import {ref} from 'vue'

const axios = require('axios');
let baseURL = 'http://localhost:3000'


export function useCombinations() {
  if (process.env.NODE_ENV === 'production') {
    baseURL = process.env.API_URL
  }

  const combinationsError = ref(null)
  const combinationsTotalError = ref(null)

  const getTotalCombinations = async (body) => {
    let totalCombinations = 0
    if (body === null || body === undefined) {
      body = {}
    }
    await axios.post(`${baseURL}/combinations/total`, body)
      .then((response) => {
        if (response.data?.error) {
          combinationsTotalError.value = response?.data
        } else {
          totalCombinations = response?.data
        }
      })
      .catch((err) => (combinationsTotalError.value = err))
    return totalCombinations
  }


  const getCombinations = async (pageNumber, nPerPage, body) => {
    let response = await axios.post(`${baseURL}/combinations/?pageNumber=${pageNumber}&nPerPage=${nPerPage}`, body)
    return response.data
  }

  const getMinMax = async (mod, attribute) => {
    let response = await axios.post(`${baseURL}/combinations/min-max`, {mod, attribute})
    return response.data
  }


  const getAbilities = async (mod) => {
    let response = await axios.post(`${baseURL}/combinations/abilities`, {mod})
    return response.data
  }


  return {
    combinationsError,
    getCombinations,
    getTotalCombinations,
    getMinMax,
    getAbilities
  }
}


