import {JOI_CHART_REQUEST_BODY_SCHEMA} from '../../globals'
import MongoServiceQuery from '../../../src/backend/services/MongoServiceQuery'
import CombinationVisualisationRequestBody from '../../types/CombinationVisualisationRequestBody'
import MongoQueryAggregationStage from '../../types/MongoQueryAggregationStage'

export default class VisualisationServiceQuery extends MongoServiceQuery {
    constructor(body: CombinationVisualisationRequestBody, query: MongoQueryAggregationStage[]) {
        super(body, JOI_CHART_REQUEST_BODY_SCHEMA, query)
    }
}
