/*****************************************************************************
 * Open MCT Web, Copyright (c) 2014-2015, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT Web is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT Web includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/
/*global define,Promise*/

/**
 * Module defining StaticModelProvider. Created by vwoeltje on 11/7/14.
 */
define(
    [],
    function () {
        "use strict";

        /**
         * Loads static models, provided as declared extensions of bundles.
         * @memberof platform/core
         * @constructor
         */
        function StaticModelProvider(models, $q, $log) {
            var modelMap = {};

            function addModelToMap(model) {
                // Skip models which don't look right
                if (typeof model !== 'object' ||
                        typeof model.id !== 'string' ||
                        typeof model.model !== 'object') {
                    $log.warn([
                        "Skipping malformed domain object model exposed by ",
                        ((model || {}).bundle || {}).path
                    ].join(""));
                } else {
                    modelMap[model.id] = model.model;
                }
            }

            // Prepoulate maps with models to make subsequent lookup faster.
            models.forEach(addModelToMap);

            return {
                /**
                 * Get models for these specified string identifiers.
                 * These will be given as an object containing keys
                 * and values, where keys are object identifiers and
                 * values are models.
                 * This result may contain either a subset or a
                 * superset of the total objects.
                 *
                 * @param {Array<string>} ids the string identifiers for
                 *        models of interest.
                 * @returns {Promise<object>} a promise for an object
                 *          containing key-value pairs, where keys are
                 *          ids and values are models
                 * @method
                 * @memberof StaticModelProvider#
                 * @memberof platform/core.StaticModelProvider#
                 */
                getModels: function (ids) {
                    var result = {};
                    ids.forEach(function (id) {
                        result[id] = modelMap[id];
                    });
                    return $q.when(result);
                }
            };
        }

        return StaticModelProvider;
    }
);
