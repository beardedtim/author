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

export class InlineResponse5001 {
    /**
    * Error message
    */
    'error': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "error",
            "baseName": "error",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return InlineResponse5001.attributeTypeMap;
    }
}

