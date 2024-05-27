import {ref} from 'vue'

import axios from 'axios'
import Mod from '~types/Mod'
import MinMaxResponse from '~types/MinMaxResponse'
import CombinationAttributeNames from '~types/CombinationAttributeNames'
import Combination from '~types/Combination'
import CombinationsRequestBody from '~types/CombinationsRequestBody'

const baseURL = 'http://localhost:3000'

export function useCombinations() {
    const combinationsTotalError = ref('')

    const getTotalCombinations = async (body: CombinationsRequestBody) => {
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

    const getCombinations = async (body: CombinationsRequestBody): Promise<Combination[]> => {
        try {
            const response = await axios.post(`${baseURL}/combinations`, body)
            return response.data as Combination[]
        } catch (err) {
            return [] as Combination[]
        }
    }

    const getMinMax = async (mod: Mod, attribute: CombinationAttributeNames): Promise<MinMaxResponse> => {
        const response = await axios.post(`${baseURL}/combinations/min-max`, {
            mod,
            attribute,
        })
        return response.data as MinMaxResponse
    }

    const getAbilities = async (mod: Mod): Promise<string[]> => {
        const response = await axios.post(`${baseURL}/combinations/abilities`, {
            mod,
        })
        return response.data as string[]
    }

    return {
        getCombinations,
        getTotalCombinations,
        getMinMax,
        getAbilities,
    }
}
