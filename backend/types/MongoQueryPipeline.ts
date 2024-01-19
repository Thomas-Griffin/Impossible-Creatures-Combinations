import {MongoRequestBody} from './MongoRequestBody';
import MongoService from '../services/mongoService';
import Joi from 'joi';
import {JOI_MOD_SCHEMA} from '../globalConstants';
import Mod from './Mod';
import AggregationStage from './AggregationStage';

export class MongoQueryPipeline {
    body: MongoRequestBody;
    service: MongoService;
    query: AggregationStage[];
    bodySchema: Joi.ObjectSchema;
    queryResult: Document[];

    constructor(body: MongoRequestBody, bodySchema: Joi.ObjectSchema, query: AggregationStage[]) {
        this.body = body;
        this.bodySchema = bodySchema || JOI_MOD_SCHEMA;
        this.service = new MongoService();
        this.query = query;
        this.queryResult = [] as Document[];
    }

    async execute() {
        try {
            const validationError = this.validateBody(this.body);
            if (validationError) {
                console.error(validationError);
                return [] as Document[];
            }
            this.queryResult = await this.getQueryResult();
            return this.queryResult;
        } catch (err) {
            console.error(err);
            return [] as Document[];
        }
    }

    private toCollectionName(mod: Mod) {
        return `${mod?.name} ${mod?.version}`;
    }

    private validateBody(body: MongoRequestBody) {
        const {error} = this.bodySchema.validate(body);
        return error;
    }

    private async getQueryResult() {
        try {
            await this.service.client.connect();
            const response = await this.service.client
                .db(process.env['MONGO_DB_NAME'])
                .collection(this.toCollectionName(this.body.mod))
                .aggregate(this.query)
                .toArray();
            await this.service.client.close();
            return response as Document[];
        } catch (err) {
            console.error(err);
            return [] as Document[];
        }
    }
}
