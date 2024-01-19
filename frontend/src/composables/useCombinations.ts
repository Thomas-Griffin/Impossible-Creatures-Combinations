import {ref} from 'vue';

import axios from 'axios';
import Mod from 'src/types/Mod';
import {GetCombinationsRequestBody} from '../types/getCombinationsRequestBody';
import Combination from '../types/Combination';
import CombinationAttributeName from '../types/CombinationAttributeName';
import {MinMaxResponse} from '../types/minMaxResponse';
import Ability from '../types/Ability';

const baseURL = 'http://localhost:3000';

export function useCombinations() {
  const combinationsTotalError = ref('');

  const getTotalCombinations = async (body: GetCombinationsRequestBody) => {
    let totalCombinations = 0;
    if (body === null || body === undefined) {
      combinationsTotalError.value = 'No mod selected';
      return totalCombinations;
    }
    await axios
      .post(`${baseURL}/combinations/total`, body)
      .then(response => {
        if (response.data?.error) {
          combinationsTotalError.value = response?.data;
        } else {
          totalCombinations = response?.data;
        }
      })
      .catch(err => (combinationsTotalError.value = err));
    return totalCombinations;
  };

  const getCombinations = async (body: GetCombinationsRequestBody): Promise<Combination[]> => {
    const response = await axios.post(`${baseURL}/combinations`, body);
    return response.data as Combination[];
  };

  const getMinMax = async (mod: Mod, attribute: CombinationAttributeName): Promise<MinMaxResponse> => {
    const response = await axios.post(`${baseURL}/combinations/min-max`, {
      mod,
      attribute
    });
    return response.data as MinMaxResponse;
  };

  const getAbilities = async (mod: Mod): Promise<Ability[]> => {
    const response = await axios.post(`${baseURL}/combinations/abilities`, {
      mod
    });
    return response.data as Ability[];
  };

  return {
    getCombinations,
    getTotalCombinations,
    getMinMax,
    getAbilities
  };
}
