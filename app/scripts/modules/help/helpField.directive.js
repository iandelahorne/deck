/*
 * Copyright 2014 Netflix, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

let angular = require('angular');


module.exports = angular.module('spinnaker.help')
  .directive('helpField', function (helpContents) {
    return {
      restrict: 'E',
      template: require('./helpField.html'),
      scope: {
        key: '@',
        fallback: '@',
        content: '@',
        placement: '@'
      },
      link: {
        pre: function (scope) {
          function applyContents() {
            if (!scope.content && scope.key) {
              scope.content = helpContents[scope.key] || scope.fallback;
            }
            scope.contents = {
              content: scope.content,
              placement: scope.placement || 'top'
            };
          }
          applyContents();

          scope.$watch('key', applyContents);
          scope.$watch('fallback', applyContents);
          scope.$watch('content', applyContents);
        }
      }
    };
  });
