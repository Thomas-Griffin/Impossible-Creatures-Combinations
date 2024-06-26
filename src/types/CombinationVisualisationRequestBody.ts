import CombinationVisualisationAttributes from './CombinationVisualisationAttributes'
import PlotlyVisualisationTypes from './PlotlyVisualisationTypes'
import Mod from './Mod'

interface CombinationVisualisationRequestBody {
    mod: Mod
    chartOptions?: {sort: boolean; chartType: PlotlyVisualisationTypes}
    attributes: {x: CombinationVisualisationAttributes; y: CombinationVisualisationAttributes}
    bucketSize?: number
    categories?: {
        x: string[]
        y: string[]
    }
}

export default CombinationVisualisationRequestBody
