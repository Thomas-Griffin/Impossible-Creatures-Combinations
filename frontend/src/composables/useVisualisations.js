import {ref} from 'vue';


let baseURL = 'http://localhost:3000'
const axios = require('axios');


export function useVisualisations() {

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
    const getCoalDistribution = async (body) => {
        let result = []
        await axios.post(`${baseURL}/visualisations/coal-distribution`, body)
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

    const getCoalDistributionPerResearchLevel = async (body) => {
        let result = []
        await axios.post(`${baseURL}/visualisations/coal-distribution-per-research-level`, body)
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

    const getElectricityDistribution = async (body) => {
        let result = []
        await axios.post(`${baseURL}/visualisations/electricity-distribution`, body)
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

    const getElectricityDistributionPerResearchLevel = async (body) => {
        let result = []
        await axios.post(`${baseURL}/visualisations/electricity-distribution-per-research-level`, body)
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
        getResearchLevelsPerStock,
        getCoalDistribution,
        getCoalDistributionPerResearchLevel,
        getElectricityDistribution,
        getElectricityDistributionPerResearchLevel
    }
}

