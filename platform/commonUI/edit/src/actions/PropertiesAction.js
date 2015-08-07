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

/**
 * Edit the properties of a domain object. Shows a dialog
 * which should display a set of properties similar to that
 * shown in the Create wizard.
 */
define(
    ['./PropertiesDialog'],
    function (PropertiesDialog) {
        'use strict';

        /**
         * Construct an action which will allow an object's metadata to be
         * edited.
         *
         * @param {DialogService} dialogService a service which will show the dialog
         * @param {DomainObject} object the object to be edited
         * @param {ActionContext} context the context in which this action is performed
         * @memberof platform/commonUI/edit
         * @constructor
         */
        function PropertiesAction(dialogService, context) {
            var object = context.domainObject;

            // Persist modifications to this domain object
            function doPersist() {
                var persistence = object.getCapability('persistence');
                return persistence && persistence.persist();
            }

            // Update the domain object model based on user input
            function updateModel(userInput, dialog) {
                return object.useCapability('mutation', function (model) {
                    dialog.updateModel(model, userInput);
                });
            }

            function showDialog(type) {
                // Create a dialog object to generate the form structure, etc.
                var dialog = new PropertiesDialog(type, object.getModel());

                // Show the dialog
                return dialogService.getUserInput(
                    dialog.getFormStructure(),
                    dialog.getInitialFormValue()
                ).then(function (userInput) {
                    // Update the model, if user input was provided
                    return userInput && updateModel(userInput, dialog);
                }).then(function (result) {
                    return result && doPersist();
                });
            }

            return {
                /**
                 * Perform this action.
                 * @return {Promise} a promise which will be
                 *         fulfilled when the action has completed.
                 * @memberof platform/commonUI/edit.PropertiesAction#
                 */
                perform: function () {
                    var type = object.getCapability('type');
                    return type && showDialog(type);
                }
            };
        }

        /**
         * Filter this action for applicability against a given context.
         * This will ensure that a domain object is present in the
         * context.
         */
        PropertiesAction.appliesTo = function (context) {
            var domainObject = (context || {}).domainObject,
                type = domainObject && domainObject.getCapability('type'),
                creatable = type && type.hasFeature('creation');

            // Only allow creatable types to be edited
            return domainObject &&
                domainObject.hasCapability("persistence") &&
                creatable;
        };

        return PropertiesAction;
    }

);


