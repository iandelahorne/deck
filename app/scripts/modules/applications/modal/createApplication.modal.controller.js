'use strict';

let angular = require('angular');

module.exports = angular
  .module('spinnaker.application.create.modal.controller', [
    require('angular-ui-router'),
    require('angular-bootstrap'),
    require('../applications.write.service.js'),
    require('../../utils/lodash.js'),
  ])
  .controller('CreateApplicationModalCtrl', function($scope, $q, $log, $state, $modalInstance, applicationWriter, _) {
    var vm = this;

    vm.appNameList = _.pluck($scope.applications, 'name');
    vm.submitting = false;
    vm.application = {};
    vm.errorMsgs = [];
    vm.emailErrorMsg = [];

    vm.clearEmailMsg = function() {
      vm.emailErrorMsg = '';
    };


    vm.createAppForAccount = function(application, accounts, deferred) {
      if(!deferred) {
        deferred = $q.defer();
      }

      var account = _.head(accounts);

      if (account) {
        applicationWriter.createApplication(application, account)
          .then(
            function(taskResponse){
              taskResponse
                .watchForTaskComplete()
                .then(function() {
                  var tailAccounts = _.tail(accounts);
                  vm.createAppForAccount(application, tailAccounts, deferred);
                });
            },
            function() {
              vm.errorMsgs.push('Could not create application');
              goIdle();
              return deferred.reject();
            }
          );
      } else {
        deferred.resolve();
      }

      deferred.notify();
      return deferred.promise;
    };


    vm.submit = function() {
      submitting();

      vm.application.name = vm.application.name.toLowerCase();

      var promise = vm.createAppForAccount(vm.application, vm.application.account);
      promise.then(
        routeToApplication,
        extractErrorMsg
      );

    };


    function routeToApplication() {
      _.delay( function() {
          $state.go(
            'home.applications.application.insight.clusters', {
              application: vm.application.name,
            }
          );
      }, 1000 );
    }

    function submitting() {
      vm.submitting = true;
    }

    function goIdle() {
      vm.submitting = false;
    }

    function assignErrorMsgs() {
      vm.emailErrorMsg = vm.errorMsgs.filter(function(msg){
        return msg
          .toLowerCase()
          .indexOf('email') > -1;
      });
    }


    function extractErrorMsg(error) {
      $log.debug('extract error', error);
      var exceptions = _.chain(error.variables)
        .where({key: 'exception'})
        .first()
        .value()
        .value
        .details
        .errors;

      angular.copy(exceptions, vm.errorMsgs );
      assignErrorMsgs();
      goIdle();

    }

    return vm;
  });
