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

import { RequestFile } from '../api';

export class InlineResponse2004DataNew {
    'key': string;
    'id': string;
    'from': string;
    'to': string;
    'rev': string;
    'relationship': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "key",
            "baseName": "_key",
            "type": "string"
        },
        {
            "name": "id",
            "baseName": "_id",
            "type": "string"
        },
        {
            "name": "from",
            "baseName": "_from",
            "type": "string"
        },
        {
            "name": "to",
            "baseName": "_to",
            "type": "string"
        },
        {
            "name": "rev",
            "baseName": "_rev",
            "type": "string"
        },
        {
            "name": "relationship",
            "baseName": "relationship",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return InlineResponse2004DataNew.attributeTypeMap;
    }
}

