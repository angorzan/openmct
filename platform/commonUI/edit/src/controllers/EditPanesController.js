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
/*global define*/

define(
    [],
    function () {
        "use strict";

        /**
         * Supports the Library and Elements panes in Edit mode.
         * @memberof platform/commonUI/edit
         * @constructor
         */
        function EditPanesController($scope) {
            var root;

            // Update root object based on represented object
            function updateRoot(domainObject) {
                var context = domainObject &&
                    domainObject.getCapability('context'),
                    newRoot = context && context.getTrueRoot(),
                    oldId = root && root.getId(),
                    newId = newRoot && newRoot.getId();

                // Only update if this has actually changed,
                // to avoid excessive refreshing.
                if (oldId !== newId) {
                    root = newRoot;
                }
            }

            // Update root when represented object changes
            $scope.$watch('domainObject', updateRoot);

            return {
                /**
                 * Get the root-level domain object, as reported by the
                 * represented domain object.
                 * @returns {DomainObject} the root object
                 * @memberof platform/commonUI/edit.EditPanesController#
                 */
                getRoot: function () {
                    return root;
                }
            };
        }

        return EditPanesController;
    }
);
