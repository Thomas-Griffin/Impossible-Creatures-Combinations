import Mod from './Mod'
import { PlotType } from 'plotly.js-dist-min'

export default interface ChartRequestBody {
  mod: Mod
  chartOptions?: { sort: boolean; chartType: PlotType }
  attributes: { x: string; y: string }
  bucketSize?: number
  categories?: {
    x: string[]
    y: string[]
  }
}
