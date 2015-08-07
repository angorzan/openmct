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
 * Module defining BundleLoader.js. Created by vwoeltje on 10/31/14.
 */
define(
    ['../Constants', './Bundle'],
    function (Constants, Bundle) {
        "use strict";

        var INVALID_ARGUMENT_MESSAGE = "Malformed loadBundles argument; " +
            "expected string or array",
            BAD_CONTENTS_PREFIX = "Invalid bundle contents for ",
            LOAD_ERROR_PREFIX = "Failed to load bundle ";

        /**
         * Loads bundle definitions and wraps them in interfaces which are
         * useful to the framework. This provides the base information which
         * will be used by later phases of framework layer initialization.
         *
         * @memberof platform/framework
         * @constructor
         * @param {object} $http Angular's HTTP requester
         * @param {object} $log Angular's logging service
         */
        function BundleLoader($http, $log) {

            // Utility function; load contents of JSON file using $http
            function getJSON(file) {
                return $http.get(file).then(function (response) {
                    return response.data;
                });
            }

            // Remove bundles which failed to load properly.
            // These should have been logged when loaded by
            // loadBundleDefinition, so at this point they are safe
            // to discard.
            function filterBundles(array) {
                return array.filter(function (x) { return x !== undefined; });
            }

            // Load a definition for a bundle
            function loadBundleDefinition(bundlePath) {
                return getJSON(bundlePath + "/" + Constants.BUNDLE_FILE).then(
                    function (x) {
                        if (x === null || typeof x !== 'object') {
                            $log.warn(BAD_CONTENTS_PREFIX + bundlePath);
                            return undefined;
                        }
                        return x;
                    },
                    function () {
                        $log.warn(LOAD_ERROR_PREFIX + bundlePath);
                        return undefined;
                    }
                );
            }

            // Load an individual bundle, as a Bundle object.
            // Returns undefined if the definition could not be loaded.
            function loadBundle(bundlePath) {
                return loadBundleDefinition(bundlePath).then(function (definition) {
                    return definition && (new Bundle(bundlePath, definition));
                });
            }

            // Load all named bundles from the array, returned as an array
            // of Bundle objects.
            function loadBundlesFromArray(bundleArray) {
                var bundlePromises = bundleArray.map(loadBundle);

                return Promise.all(bundlePromises)
                        .then(filterBundles);
            }

            // Load all bundles named in the referenced file. The file is
            // presumed to be a JSON file
            function loadBundlesFromFile(listFile) {
                return getJSON(listFile).then(loadBundlesFromArray);
            }

            // Load all indicated bundles. If the argument is an array,
            // this is taken to be a list of all bundles to load; if it
            // is a string, then it is treated as the name of a JSON
            // file containing the list of bundles to load.
            function loadBundles(bundles) {
                return Array.isArray(bundles) ? loadBundlesFromArray(bundles) :
                        (typeof bundles === 'string') ? loadBundlesFromFile(bundles) :
                                Promise.reject(new Error(INVALID_ARGUMENT_MESSAGE));
            }


            return {
                /**
                 * Load a group of bundles, to be used to constitute the
                 * application by later framework initialization phases.
                 *
                 * @memberof BundleLoader#
                 * @param {string|string[]} an array of bundle names to load, or
                 *        the name of a JSON file containing that array
                 * @returns {Promise.<Bundle[]>}
                 * @memberof platform/framework.BundleLoader#
                 */
                loadBundles: loadBundles
            };
        }

        return BundleLoader;
    }
);
