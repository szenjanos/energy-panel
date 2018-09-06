'use strict';

angular.module('add.view', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/add-new-reading', {
    templateUrl: 'add-reading/add-reading.html',
    controller: 'AddCtrl'
  });
}])

.controller('AddCtrl', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){

    
    if(!$rootScope.loginResponse){
		$location.path('/login');
	}
      $scope.addReading = function(value) {
        if ($scope.loginResponse) {
            var request = {
                date: new Date(),
                value: $scope.reading.value
            };
            $http.post('https://energy-panel.firebaseio.com/readings/' + $scope.loginResponse.data.localId + '.json?auth=' + $scope.loginResponse.data.idToken, request).then(function() {
            $rootScope.goto('list-readings');    
            $rootScope.addReadingToast();    
            });
        } else {
            $location.path('/login');
        }
    };
    

}])