import {MongoQueryPipeline} from './MongoQueryPipeline';
import ChartRequestBody from './ChartRequestBody';
import {JOI_CHART_REQUEST_BODY_SCHEMA} from '../globalConstants';
import AggregationStage from './AggregationStage';
import MongoService from '../services/mongoService';

export class ChartQueryPipeline extends MongoQueryPipeline {
    constructor(body: ChartRequestBody, query: AggregationStage[]) {
        super(MongoService.getInstance(), body, JOI_CHART_REQUEST_BODY_SCHEMA, query);
    }
}
