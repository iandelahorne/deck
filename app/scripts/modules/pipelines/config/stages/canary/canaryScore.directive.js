'use strict';

let angular = require('angular');

module.exports = angular.module('spinnaker.pipelines.stages.canary.score.directive', [])
  .directive('canaryScore', function() {
    return {
      restrict: 'E',
      scope: {
        score: '=',
        health: '=?',
        result: '=',
      },
      template: '<span class="score label label-default label-{{healthLabel}}">{{score}}</span>',
      link: function(scope) {
        function applyLabel() {
          scope.result = scope.result ? scope.result.toLowerCase() : '';
          scope.health = scope.health ? scope.health.toLowerCase() : '';
          if ((scope.score !== 0 && !scope.score) || scope.score < 0) {
            scope.score = 'N/A';
          }

          scope.healthLabel = scope.health === 'unhealthy' ? 'unhealthy'
            : scope.result === 'success' ? 'healthy'
            : scope.result === 'failure' ? 'failing'
            : 'unknown';
        }

        scope.$watch('health', applyLabel);
      }
    };
  });
