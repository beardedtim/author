/* tslint:disable */
/* eslint-disable */
/**
 * Author
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    InlineObject,
    InlineObjectFromJSON,
    InlineObjectToJSON,
    InlineResponse2002,
    InlineResponse2002FromJSON,
    InlineResponse2002ToJSON,
} from '../models';

export interface CreateActorRequest {
    inlineObject?: InlineObject;
}

/**
 * 
 */
export class APIV1ActorsApi extends runtime.BaseAPI {

    /**
     * Create Actor
     */
    async createActorRaw(requestParameters: CreateActorRequest): Promise<runtime.ApiResponse<InlineResponse2002>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/actors`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: InlineObjectToJSON(requestParameters.inlineObject),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => InlineResponse2002FromJSON(jsonValue));
    }

    /**
     * Create Actor
     */
    async createActor(requestParameters: CreateActorRequest): Promise<InlineResponse2002> {
        const response = await this.createActorRaw(requestParameters);
        return await response.value();
    }

}
