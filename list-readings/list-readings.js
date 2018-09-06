'use strict';

angular.module('list.view', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/list-readings', {
    templateUrl: 'list-readings/list-readings.html',
    controller: 'ListCtrl'
  });
}])


.controller('ListCtrl', ['$scope', '$rootScope', '$http', '$location', '$filter', function($scope, $rootScope, $http, $location, $filter){


	if(!$rootScope.loginResponse){
		$location.path('/login');
	}
    
       $scope.getReadings = function() {
        
        if ($rootScope.loginResponse) {
                $http.get('https://energy-panel.firebaseio.com/readings/' + $scope.loginResponse.data.localId + '.json?auth=' + $scope.loginResponse.data.idToken).then(function(response) {
                    if (response.data && response.data !== 'null') {
                        $scope.readings = response.data;
                        $scope.readingsArray = [];
                        
                        $scope.chartData = [
                            {
                                "key" : "Reading" ,
                                "bar": true,
                                "values" : []
                            }];
                       
                      $scope.options = {
                                chart: {
                                    type: 'discreteBarChart',
                                    height: 450,
                                    margin : {
                                        top: 20,
                                        right: 20,
                                        bottom: 65,
                                        left: 60
                                    },
                                    x: function(d){return d[0];},
                                    y: function(d){return d[1]/1;},
                                    showValues: true,
                                    valueFormat: function(d){
                                        return d3.format(',.1f')(d);
                                    },
                                    duration: 100,
                                    xAxis: {
                                        axisLabel: '',
                                        tickFormat: function(d) {
                                            return d3.time.format('%x')(new Date(d))
                                        },
                                        rotateLabels: 30,
                                        showMaxMin: false
                                    },
                                    yAxis: {
                                        axisLabel: '',
                                        axisLabelDistance: -10,
                                        tickFormat: function(d){
                                            return d3.format(',.1f')(d);
                                        }
                                    },
                                    tooltip: {
                                        keyFormatter: function(d) {
                                            return d3.time.format('%x')(new Date(d));
                                        }
                                    },
                                    zoom: {
                                        enabled: true,
                                        scaleExtent: [1, 1],
                                        useFixedDomain: false,
                                        useNiceScale: false,
                                        horizontalOff: false,
                                        verticalOff: true,
                                        unzoomEventType: 'dblclick.zoom'
                                    }
                                }
                            };
                        
                        
                        angular.forEach(response.data, function(reading, key) {
                          $scope.readingsArray.push(reading);
                          var timestamped = new Date(reading.date).getTime();
                          $scope.chartData[0].values.push([timestamped, reading.value]); 
                        });
                        $scope.readingsArray = $filter('orderBy')($scope.readingsArray, 'date');
                        $rootScope.lastReading = $scope.readingsArray[$scope.readingsArray.length - 1];
                        $rootScope.penultimate = $scope.readingsArray[$scope.readingsArray.length - 2];
                    } else {
                        console.log("No data");
                    }
                }, function(errorResponse) {
                    alert(errorResponse.data.error.message);
                });
            } else {
                $location.path('/login');
            }
        }
       
       $scope.deleteReading = function(key) {
        if ($scope.loginResponse) {
            $http.delete('https://energy-panel.firebaseio.com/readings/' + $scope.loginResponse.data.localId + '/' + key + '.json?auth=' + $scope.loginResponse.data.idToken).then(function() {
                $scope.getReadings();
                $rootScope.deleteReadingToast();
            });
        } else {
            $location.path('/login');
        }
       }
       
       
       
       $scope.enableEdit = function() {
           $scope.editMode = true; 
       }
       $scope.disableEdit = function() {
           $scope.editMode = false; 
       }
    
       $scope.updateReading = function(key) {
          
         if ($scope.loginResponse) {
            var update = {
                date: $scope.readings[key].date,
                value: $rootScope.update.value
            };
                
         $http.put('https://energy-panel.firebaseio.com/readings/' + $scope.loginResponse.data.localId + '/' + key + '.json?auth=' + $scope.loginResponse.data.idToken, update).then(function() {
            $scope.getReadings();
            $scope.editMode = false; 
            $rootScope.updateReadingToast(); 
         });
         } else {
            $location.path('/login');
         }
    }
}])