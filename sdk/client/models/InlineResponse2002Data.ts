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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface InlineResponse2002Data
 */
export interface InlineResponse2002Data {
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2002Data
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2002Data
     */
    name: string;
}

export function InlineResponse2002DataFromJSON(json: any): InlineResponse2002Data {
    return InlineResponse2002DataFromJSONTyped(json, false);
}

export function InlineResponse2002DataFromJSONTyped(json: any, ignoreDiscriminator: boolean): InlineResponse2002Data {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['_id'],
        'name': json['name'],
    };
}

export function InlineResponse2002DataToJSON(value?: InlineResponse2002Data | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        '_id': value.id,
        'name': value.name,
    };
}

