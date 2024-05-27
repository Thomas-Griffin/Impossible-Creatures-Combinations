import CombinationVisualisationAttributes from '~types/CombinationVisualisationAttributes'
import PlotlyVisualisationTypes from '~types/PlotlyVisualisationTypes'
import Mod from '~types/Mod'

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
