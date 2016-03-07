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
	this.locations = [];
	this.load = $http.get('/locations.json');
	this.process = function(locations) {
		return locations.sort(function(a, b){
		    var keyA = a.state,
		        keyB = b.state;
		    // Compare the 2 dates
		    if(keyA < keyB) return -1;
		    if(keyA > keyB) return 1;
		    return 0;
		});
	};
	this.stateLocations = function(locations) {
		var statesArray = []
		var stateItemsArray = [];
		var lastState = null;
		locations.map(function(locationItem){
			
			if (lastState === null) {
				stateItemsArray.push(locationItem)
				lastState = locationItem.state
			} else if (locationItem.state === lastState) {
				stateItemsArray.push(locationItem)
			} else if (locationItem.state != lastState){
				lastState = locationItem.state
				statesArray.push(stateItemsArray)
				stateItemsArray = [locationItem]
			}

		});
		statesArray.push(stateItemsArray);

		return statesArray
	};

})



//controllers

.controller('homeController', ['$scope', 'locationService', 'filterFilter',
	function($scope, locationService, filterFilter){
	$scope.locations = [];
	$scope.states = [];
	$scope.selected = [];

	locationService.load.then(function(locations){
		$scope.locations = locationService.process(locations.data);
		// $scope.locations = angular.fromJson(locations.data);
		$scope.states = locationService.stateLocations(locations.data);

	});

	$scope.$watch('locations', function(newVal) {
		locationService.locations = newVal;
	});

	// $scope.$watch('selected', function(newVal) {
	// 	console.log('changed')
	// }, true);



}])

.controller('stateContainerController',['$scope', 
	function($scope){

	// toggle selection for a given fruit by name
	  $scope.toggleSelection = function toggleSelection(locationId) {
	    var idx = $scope.selected.indexOf(locationId);

	    // is currently selected
	    if (idx > -1) {
	      $scope.selected.splice(idx, 1);
	    }

	    // is newly selected
	    else {
	      $scope.selected.push(locationId);
	    }
  };


}])


//directives

.directive('locationList', function(){
	return {
		scope: false,
		templateUrl: 'directives/locationList.html',
		replace: true

	}
})
.directive('stateContainer', function(){
	return {
		scope: {
			stateLocation: '=stateLocation',
			selected:'='
		},
		templateUrl: 'directives/stateContainer.html',
		replace: true,
		controller: 'stateContainerController'
	}
})

;



