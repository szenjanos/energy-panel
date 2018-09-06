'use strict';

angular.module('energyPanel', [
  'ngRoute',
  'ngMaterial',
  'ngAnimate',
  'ngAria',
  'md.data.table',
  'ngMessages',
  'nvd3',
  'login.view',       
  'list.view',
  'add.view'    
 
  
]).
config(['$locationProvider', '$routeProvider', '$mdThemingProvider', function($locationProvider, $routeProvider, $mdThemingProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});  
     
    
  $mdThemingProvider.theme('default')
  .primaryPalette('indigo')
  .accentPalette('indigo');

}])

.controller('AppCtrl', ['$scope', '$rootScope', '$location', '$mdToast', function MenuCtrl($scope, $rootScope, $location, $mdToast) {
    $rootScope.currentNavItem = 'list-readings';
    $rootScope.goto = function (current) {
        $location.path('/' + current);
    }
    $rootScope.$on('$routeChangeSuccess', function (event, current) {
        $rootScope.currentNavItem = String(current.$$route.originalPath).replace('/', '');
    })
    
    var last = {
        bottom: false
        , top: true
        , left: false
        , right: true
    };
    $scope.toastPosition = angular.extend({}, last);
    $scope.getToastPosition = function () {
        sanitizePosition();
        return Object.keys($scope.toastPosition).filter(function (pos) {
            return $scope.toastPosition[pos];
        }).join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;
        if (current.bottom && last.top) current.top = false;
        if (current.top && last.bottom) current.bottom = false;
        if (current.right && last.left) current.left = false;
        if (current.left && last.right) current.right = false;
        last = angular.extend({}, current);
    }
    $rootScope.addReadingToast = function () {
        var pinTo = $scope.getToastPosition();
        $mdToast.show($mdToast.simple().textContent('Reading added successfully!').position(pinTo).hideDelay(3000));
    };
    $rootScope.deleteReadingToast = function () {
        var pinTo = $scope.getToastPosition();
        $mdToast.show($mdToast.simple().textContent('Reading deleted successfully!').position(pinTo).hideDelay(3000));
    };
    $rootScope.updateReadingToast = function () {
        var pinTo = $scope.getToastPosition();
        $mdToast.show($mdToast.simple().textContent('Reading updated successfully!').position(pinTo).hideDelay(3000));
    };

}])
    
.controller('ToastCtrl', ['$scope', '$mdToast', function ($scope, $mdToast) {
    $scope.closeToast = function () {
        $mdToast.hide();
    };
}])


