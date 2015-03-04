'use strict';

var AngularApp, ImplementationA, ImplementationB, Dependency;

Dependency = function() {};
Dependency.prototype.magicNumber = 42;

ImplementationA = function(dependency) {
  this.dependency = dependency;
};

ImplementationA.prototype.foo = function() {
  return "bar" + this.dependency.magicNumber;
};

ImplementationB = function(dependency) {
  this.dependency = dependency;
};

ImplementationB.prototype.foo = function() {
  return "baz" + this.dependency.magicNumber;
}

AngularApp = angular.module('diFunApp', [])
        // Config:
        // Change a constant underneath to change underlying implementation of ServiceWithConfiguredImplementation:
        .constant("EnvType", "test")
        // Registering implementations:
        .constant("ImplementationA", ImplementationA)
        .constant("ImplementationB", ImplementationB) 
        // Constant implementation:
        .service('Dependency', Dependency);

AngularApp.provider('ServiceWithConfiguredImplementation', ['EnvType', 'ImplementationA', 'ImplementationB', function(env, implementationA, implementationB) {
  var implementation = {
    true: implementationA,
    false: implementationB
  };

  this.$get = ['Dependency', 'EnvType', function(Dependency, EnvType) {
    return new implementation[EnvType == "test"](Dependency);
  }];

  return this;
}]);

AngularApp.controller('Controller', ['$scope', 'ServiceWithConfiguredImplementation', function($scope, service) {
  $scope.value = service.foo();
}]);
