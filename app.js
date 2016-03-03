angular.module('locationComponent', ['ngRoute', 'ngResource'])


//routes
.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'pages/home.html',
			controller: 'homeController'
		})

})

// service
.service('locationService', function($http) {
	// this.locations = [];

	this.load = $http.get('/locations.json');

})



//controllers

.controller('homeController', ['$scope', 'locationService', 'filterFilter',
	function($scope, locationService, filterFilter){
	$scope.locations = [];

	locationService.load.then(function(locations){
		$scope.locations = locations.data		
		// $scope.locations = angular.fromJson(locations.data);
	})




}])


//directives

.directive('locationList', function(){
	return {
		scope: false,
		templateUrl: 'directives/locationList.html',
		replace: true

	}
})


;



