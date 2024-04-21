import ChartTypes from "./enums/ChartTypes";
import type { LayoutAxis } from "plotly.js-dist-min";

export default interface Chart {
  id: string;
  title: string;
  type: ChartTypes;
  fetchFunction: CallableFunction;
  xAxis: Partial<LayoutAxis>;
  yAxis: Partial<LayoutAxis>;
}
