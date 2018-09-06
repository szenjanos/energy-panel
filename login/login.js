'use strict';

angular.module('login.view', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/login', {
		templateUrl: 'login/login.html',
		controller: 'LoginCtrl'
	});
}])

.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location){
        
    
$rootScope.signIn = function() {
        
        var request = {
            email: $scope.user.email,
            password: $scope.user.password,
            returnSecureToken: true
        };
        $http.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAaajtvAm4AbvTrLv2BRVhzvTFQ_UgTAPs', request).then(function(loginResponse) {
            $rootScope.loginResponse = loginResponse;
            
            if ($rootScope.loginResponse) {
                $location.path('/list-readings');
            } else {
                $location.path('/login');
            }
           
        }, function(errorResponse) {
            alert(errorResponse.data.error.message);
        });
    }    

}])