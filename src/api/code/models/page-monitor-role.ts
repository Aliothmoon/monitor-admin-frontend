// tslint:disable
/**
 * Monitor-Backend
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { MonitorRole } from './monitor-role';

/**
 * 
 * @export
 * @interface PageMonitorRole
 */
export interface PageMonitorRole {
    /**
     * 
     * @type {Array<MonitorRole>}
     * @memberof PageMonitorRole
     */
    records?: Array<MonitorRole>;
    /**
     * 
     * @type {number}
     * @memberof PageMonitorRole
     */
    pageNumber?: number;
    /**
     * 
     * @type {number}
     * @memberof PageMonitorRole
     */
    pageSize?: number;
    /**
     * 
     * @type {number}
     * @memberof PageMonitorRole
     */
    maxPageSize?: number;
    /**
     * 
     * @type {number}
     * @memberof PageMonitorRole
     */
    totalPage?: number;
    /**
     * 
     * @type {number}
     * @memberof PageMonitorRole
     */
    totalRow?: number;
    /**
     * 
     * @type {boolean}
     * @memberof PageMonitorRole
     */
    optimizeCountQuery?: boolean;
}


