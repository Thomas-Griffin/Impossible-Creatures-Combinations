import { ref } from 'vue'

import axios from 'axios'

const baseURL = 'http://localhost:3000'

export function useVisualisations() {
  const visualisationsError = ref(null);

  const getResearchLevelsPerStock = async (body: object) => {
    let result: never[] = [];
    await axios
      .post(`${baseURL}/visualisations/research-levels-per-stock`, body)
      .then((response) => {
        if (response.data?.error) {
          visualisationsError.value = response?.data;
        } else {
          result = response?.data;
        }
      })
      .catch((err) => (visualisationsError.value = err));
    return result;
  };
  const getCoalDistribution = async (body: object) => {
    let result: never[] = [];
    await axios
      .post(`${baseURL}/visualisations/coal-distribution`, body)
      .then((response) => {
        if (response.data?.error) {
          visualisationsError.value = response?.data;
        } else {
          result = response?.data;
        }
      })
      .catch((err) => (visualisationsError.value = err));
    return result;
  };

  const getCoalDistributionPerResearchLevel = async (body: object) => {
    let result: never[] = [];
    await axios
      .post(
        `${baseURL}/visualisations/coal-distribution-per-research-level`,
        body
      )
      .then((response) => {
        if (response.data?.error) {
          visualisationsError.value = response?.data;
        } else {
          result = response?.data;
        }
      })
      .catch((err) => (visualisationsError.value = err));
    return result;
  };

  const getElectricityDistribution = async (body: object) => {
    let result: never[] = [];
    await axios
      .post(`${baseURL}/visualisations/electricity-distribution`, body)
      .then((response) => {
        if (response.data?.error) {
          visualisationsError.value = response?.data;
        } else {
          result = response?.data;
        }
      })
      .catch((err) => (visualisationsError.value = err));
    return result;
  };

  const getElectricityDistributionPerResearchLevel = async (body: object) => {
    let result: never[] = [];
    await axios
      .post(
        `${baseURL}/visualisations/electricity-distribution-per-research-level`,
        body
      )
      .then((response) => {
        if (response.data?.error) {
          visualisationsError.value = response?.data;
        } else {
          result = response?.data;
        }
      })
      .catch((err) => (visualisationsError.value = err));
    return result;
  };

  return {
    visualisationsError,
    getResearchLevelsPerStock,
    getCoalDistribution,
    getCoalDistributionPerResearchLevel,
    getElectricityDistribution,
    getElectricityDistributionPerResearchLevel,
  };
}
