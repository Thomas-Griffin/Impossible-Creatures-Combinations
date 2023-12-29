import { ref } from 'vue'

import axios from 'axios'
import { Data } from 'plotly.js'

const baseURL = 'http://localhost:3000'

export function useVisualisations() {
  const visualisationsError = ref(null)

  const getAttributeChart = async (body: object): Promise<Data[]> => {
    let result: Data[] = []
    await axios
      .post(`${baseURL}/visualisations/attribute-chart`, body)
      .then(response => {
        if (response.data?.error) {
          visualisationsError.value = response?.data
        } else {
          result = response?.data
        }
      })
      .catch(err => (visualisationsError.value = err))
    return result
  }

  const getXPerYChart = async (body: object): Promise<Data[]> => {
    let result: Data[] = []
    await axios
      .post(`${baseURL}/visualisations/x-per-y-chart`, body)
      .then(response => {
        if (response.data?.error) {
          visualisationsError.value = response?.data
        } else {
          result = response?.data
        }
      })
      .catch(err => (visualisationsError.value = err))
    console.log(result)
    return result
  }

  return {
    visualisationsError,
    getAttributeChart,
    getXPerYChart
  }
}
