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
    InlineObject2,
    InlineObject2FromJSON,
    InlineObject2ToJSON,
    InlineResponse2004,
    InlineResponse2004FromJSON,
    InlineResponse2004ToJSON,
} from '../models';

export interface CreateRelationshipRequest {
    inlineObject2?: InlineObject2;
}

/**
 * 
 */
export class APIV1RelationshipsApi extends runtime.BaseAPI {

    /**
     * Create Relationship
     */
    async createRelationshipRaw(requestParameters: CreateRelationshipRequest): Promise<runtime.ApiResponse<InlineResponse2004>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/relationships`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: InlineObject2ToJSON(requestParameters.inlineObject2),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => InlineResponse2004FromJSON(jsonValue));
    }

    /**
     * Create Relationship
     */
    async createRelationship(requestParameters: CreateRelationshipRequest): Promise<InlineResponse2004> {
        const response = await this.createRelationshipRaw(requestParameters);
        return await response.value();
    }

}
