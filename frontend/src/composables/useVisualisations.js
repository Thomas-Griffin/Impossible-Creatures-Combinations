import {ref} from 'vue';


let baseURL = 'http://localhost:3000'
const axios = require('axios');


export function useVisualisations() {
  if (process.env.NODE_ENV === 'production') {
    baseURL = process.env.API_URL
  }

  const visualisationsError = ref(null)

  const getResearchLevelsPerStock = async (body) => {
    let result = []
    await axios.post(`${baseURL}/visualisations/research-levels-per-stock`, body)
      .then((response) => {
        if (response.data?.error) {
          visualisationsError.value = response?.data
        } else {
          result = response?.data
        }
      })
      .catch((err) => (visualisationsError.value = err))
    return result
  }

  return {
    visualisationsError,
    getResearchLevelsPerStock
  }
}


