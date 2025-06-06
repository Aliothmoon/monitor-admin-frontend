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

/**
 *
 * @export
 * @interface MonitorBehaviorRecord
 */
export interface MonitorBehaviorRecord {
  /**
   *
   * @type {number}
   * @memberof MonitorBehaviorRecord
   */
  recordId?: number;
  /**
   *
   * @type {number}
   * @memberof MonitorBehaviorRecord
   */
  userId?: number;
  /**
   *
   * @type {number}
   * @memberof MonitorBehaviorRecord
   */
  behaviorType?: number;
  /**
   *
   * @type {string}
   * @memberof MonitorBehaviorRecord
   */
  behaviorDetail?: string;
  /**
   *
   * @type {string}
   * @memberof MonitorBehaviorRecord
   */
  createdAt?: string;
  /**
   *
   * @type {string}
   * @memberof MonitorBehaviorRecord
   */
  updatedAt?: string;
  /**
   *
   * @type {number}
   * @memberof MonitorBehaviorRecord
   */
  createdBy?: number;
  /**
   *
   * @type {number}
   * @memberof MonitorBehaviorRecord
   */
  updatedBy?: number;
}
