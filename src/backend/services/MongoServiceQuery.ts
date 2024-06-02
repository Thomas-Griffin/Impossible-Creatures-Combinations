import MongoService from '../services/mongoService'
import Joi from 'joi'
import logger from '../utility/logger'
import {COMBINATIONS_COLLECTION_NAME, JOI_MOD_SCHEMA} from '../../globals'
import MongoServiceRequestBody from '../../../src/types/MongoServiceRequestBody'
import MongoQueryAggregationStage from '../../../src/types/MongoQueryAggregationStage'

export default class MongoServiceQueryPipeline {
    body: MongoServiceRequestBody
    service: MongoService
    query: MongoQueryAggregationStage[]
    bodySchema: Joi.ObjectSchema
    queryResult: Document[]

    constructor(body: MongoServiceRequestBody, bodySchema: Joi.ObjectSchema, query: MongoQueryAggregationStage[]) {
        this.service = new MongoService()

        this.body = body
        this.bodySchema = bodySchema || JOI_MOD_SCHEMA
        this.query = query
        this.queryResult = [] as Document[]
    }

    async execute() {
        try {
            const validationError = this.validateBody(this.body)
            if (validationError) {
                logger.error(validationError)
                return [] as Document[]
            }
            this.queryResult = await this.getQueryResult()
            return this.queryResult
        } catch (err) {
            logger.error(err)
            return [] as Document[]
        }
    }

    private validateBody(body: MongoServiceRequestBody) {
        const {error} = this.bodySchema.validate(body)
        return error
    }

    private async getQueryResult() {
        try {
            await this.service.client.connect()
            const response = await this.service.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(COMBINATIONS_COLLECTION_NAME)
                .aggregate(this.query)
                .toArray()
            await this.service.client.close()
            return response as Document[]
        } catch (err) {
            logger.error(err)
            return [] as Document[]
        }
    }
}
