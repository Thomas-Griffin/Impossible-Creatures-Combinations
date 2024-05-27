import {JOI_CHART_REQUEST_BODY_SCHEMA} from '@src/globals'
import MongoServiceQuery from '@backend/services/MongoServiceQuery'
import CombinationVisualisationRequestBody from '~types/CombinationVisualisationRequestBody'
import MongoQueryAggregationStage from '~types/MongoQueryAggregationStage'

export default class VisualisationServiceQuery extends MongoServiceQuery {
    constructor(body: CombinationVisualisationRequestBody, query: MongoQueryAggregationStage[]) {
        super(body, JOI_CHART_REQUEST_BODY_SCHEMA, query)
    }
}
