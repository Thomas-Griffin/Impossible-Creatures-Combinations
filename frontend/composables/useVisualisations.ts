import {ref} from 'vue';

import axios from 'axios';
import type {NuxtPlotlyData} from "nuxt-plotly";


const baseURL = 'http://localhost:3000';

export function useVisualisations() {
    const visualisationsError = ref(null);

    const getAttributeChart = async (body: object): Promise<NuxtPlotlyData[]> => {
        let result: NuxtPlotlyData[] = [];
        await axios
            .post(`${baseURL}/visualisations/attribute-chart`, body)
            .then(response => {
                if (response.data?.error) {
                    visualisationsError.value = response?.data;
                } else {
                    result = response?.data;
                }
            })
            .catch(err => (visualisationsError.value = err));
        return result;
    };

    const getXPerYChart = async (body: object): Promise<NuxtPlotlyData[]> => {
        let result: NuxtPlotlyData[] = [];
        await axios
            .post(`${baseURL}/visualisations/x-per-y-chart`, body)
            .then(response => {
                if (response.data?.error) {
                    visualisationsError.value = response?.data;
                } else {
                    result = response?.data;
                }
            })
            .catch(err => (visualisationsError.value = err));
        return result;
    };

    return {
        visualisationsError,
        getAttributeChart,
        getXPerYChart
    };
}
