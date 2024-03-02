export * from './aPIV1ActorsApi';
import { APIV1ActorsApi } from './aPIV1ActorsApi';
export * from './aPIV1PermissionsApi';
import { APIV1PermissionsApi } from './aPIV1PermissionsApi';
export * from './aPIV1RelationshipsApi';
import { APIV1RelationshipsApi } from './aPIV1RelationshipsApi';
export * from './aPIV1ResourcesApi';
import { APIV1ResourcesApi } from './aPIV1ResourcesApi';
export * from './internalApi';
import { InternalApi } from './internalApi';
import * as fs from 'fs';
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;

export const APIS = [APIV1ActorsApi, APIV1PermissionsApi, APIV1RelationshipsApi, APIV1ResourcesApi, InternalApi];
