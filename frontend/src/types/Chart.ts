import { LayoutAxis } from 'plotly.js'
import ChartTypes from './ChartTypes'

export default interface Chart {
  id: string
  title: string
  type: ChartTypes
  fetchFunction: CallableFunction
  xAxis: Partial<LayoutAxis>
  yAxis: Partial<LayoutAxis>
}
