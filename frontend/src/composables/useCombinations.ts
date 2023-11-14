import { ref } from 'vue'

import axios from 'axios'
import { Mod } from 'src/types/Mod'
import { GetTotalCombinationsRequestBody } from '../types/getTotalCombinationsRequestBody'

const baseURL = 'http://localhost:3000'

export function useCombinations() {
  const combinationsTotalError = ref('')

  const getTotalCombinations = async (body: GetTotalCombinationsRequestBody) => {
    let totalCombinations = 0
    if (body === null || body === undefined) {
      combinationsTotalError.value = 'No mod selected'
      return totalCombinations
    }
    await axios
      .post(`${baseURL}/combinations/total`, body)
      .then(response => {
        if (response.data?.error) {
          combinationsTotalError.value = response?.data
        } else {
          totalCombinations = response?.data
        }
      })
      .catch(err => (combinationsTotalError.value = err))
    return totalCombinations
  }

  const getCombinations = async (pageNumber: number, nPerPage: number, body: object) => {
    const response = await axios.post(`${baseURL}/combinations/?pageNumber=${pageNumber}&nPerPage=${nPerPage}`, body)
    return response.data
  }

  const getMinMax = async (mod: Mod, attribute: string) => {
    const response = await axios.post(`${baseURL}/combinations/min-max`, {
      mod,
      attribute
    })
    return response.data
  }

  const getAbilities = async (mod: Mod) => {
    const response = await axios.post(`${baseURL}/combinations/abilities`, {
      mod
    })
    return response.data
  }

  return {
    getCombinations,
    getTotalCombinations,
    getMinMax,
    getAbilities
  }
}
