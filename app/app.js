'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ui.router',
  'highcharts-ng',
  'ui.bootstrap'
]);

app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/home");
  //
  // Now set up the states
  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "partials/home.html"
    })
    .state('list', {
      url: "/list",
      templateUrl: "partials/list.html",
	  controller: "doctorListController"
    })
    .state('state2', {
      url: "/state2",
      templateUrl: "partials/dash.html"

    })
    .state('delete', {
      url: "/delete/{id}",
      templateUrl: "partials/doctortron.html",
	  controller: "doctorTronController"

    })
    .state('view', {
      url: "/view/{id}",
      templateUrl: "partials/view.html",
	  controller: "doctorViewController"
    })
    .state('edit2', {
      url: "/edit2/{id}",
      templateUrl: "partials/edit.html",
	  controller: function($scope, $stateParams, $state, doctorService, doctorCollection) {
		 //doctorCollection.getDoctorById($stateParams.id).then(function (data) {
		 // 	 $scope.doctor = data.data;
		 // 			 console.log("The edit ID test controller data:");
		 // 			 console.log(data);
		 // });
		 var monkey;
		  console.log($state.params.id);
		 doctorCollection.then(function (doctors, getDoctorById) {
			  monkey = doctors;
			  //$scope.doctor = getDoctorById(12);
			  $scope.doctor = monkey.getDoctorById($stateParams.id) ;
	 		 console.log("The doctorCollection promis callback");
	 		 console.log(monkey);
			 console.log($scope.doctor);
			 console.log($stateParams);
			 console.log(monkey.doctors[0])
		  });
		  //$scope.doctor = monkey;
		 //$scope.doctor = $scope.doctors[$stateParams];
	 	 //$scope.doctor = doctorCollection.doctors[$stateParams.id];
		 console.log("The edit ID test controller data:");
		 console.log(monkey);
		 console.log($stateParams);
	  }
    });
});



app.controller('MainCtrl', function($scope) {
	$scope.showSide = false;
});

app.service('doctorService', ['$http',  function($http) {
     
    var apiKey = '?apiKey=wex6lY15scV4DxBT5JaQKGGuJru4efH9'
    ,host = 'https://api.mongolab.com'
    ,path = '/api/1/databases/21jump/collections/doctors'
    ,query = "?q=";

    this.getDoctors = function() {
                     var uri = host + path + apiKey;
            return $http({method: 'GET', url: uri});
      };
    this.getDoctorByID = function(id) {
            var uri = host + path + "/" + id + apiKey;
            return $http({method: 'GET', url: uri});
    }
    this.deleteDoctorByID = function(id) {
            var uri = host + path + "/" + id + apiKey;
            return $http({method: 'DELETE', url: uri});
    }
      //test
      //return {name: "test doctor"};
     
}]);


app.factory('doctorCollection', ['doctorService', '$q', function(doctorService, $q) {
//promise me I'll get a buncha doctors back
	var deferred = $q.defer();
	var bunchaDoctors = [];
	doctorService.getDoctors()
	.then(function(data) {
		bunchaDoctors = data.data;
		// for(var i in bunchaDoctors) {
		// 	bunchaDoctors[i].id = i;
		// 	//console.log(bunchaDoctors[i]);
		// }
		_.each(bunchaDoctors, function(doc, num) {
			doc.id = num;
		});
		deferred.resolve({
			doctors: bunchaDoctors,
			getDoctorById: function(id) {
				for(var i in bunchaDoctors) {
					if (bunchaDoctors[i].id == id) {
						return bunchaDoctors[i];
					}
				}
			}
		});
	}, function(err) {
		deferred.reject(err);
		console.log("Bad news Doctors");
	});
	return deferred.promise;
		
}]);
 
//angular.module('myApp',[]).controller('doctorListController', ['$scope', function($scope) {
       
app.controller('doctorListController',  ['$rootScope','$stateParams', '$scope', 'doctorService', 'doctorCollection', '$state', '$modal', '$log', function($rootScope, $stateParams, $scope, doctorService, $state, $modal, $log) {
		  $scope.showSide = false;
          $scope.choosen_doctor = {};
		  $scope.doctors = $rootScope.doctors.doctors;
		  // $scope.open = function(doctorNumber) {
		  // 			  console.log(doctorNumber);
		  // 			 $scope.doctor = $rootScope.doctors.getDoctorById(doctorNumber);
		  // 			 console.log($scope.doctor);
		  // };

		  
 }]);
 

app.controller('doctorTronController',  ['$rootScope', '$stateParams', '$scope', 'doctorService', 'doctorCollection', '$state', function($rootScope, $stateParams, $scope, doctorService, doctorCollection, $state) {
  $scope.newDoctor = function() {
         console.log("requested a doctor be deleted");
        }
       
        //$scope.singleDoctor = doctorService.getDoctorByID($stateParams.id);
		$scope.doctor = $rootScope.doctors.getDoctorById($stateParams.id);
		$scope.annihilate = function() {
			console.log($scope.doctor);
			console.log($scope.doctor._id);
			console.log($scope.doctor._id.$oid);
			doctorService.deleteDoctorByID($scope.doctor._id.$oid);
			$scope.doctor.deleted = true;
			$rootScope.doctors.doctors = _.reject($rootScope.doctors.doctors, function(doc) {
				if(doc.deleted) {
					console.log("Found Delted Doctor: " + doc.id + " " + doc["First Name"] + " " + doc["Last Name/Organizaiton Name"]);
					return true;
				}
			});
			$state.go('list');
			//doctorService.deleteDoctorByID(doctor.$scope.doctor._id)
		}
  }]);
 
 
 app.controller('doctorViewController', ['$scope', '$stateParams', 'doctorService', 'doctorCollection', function($scope, $stateParams, doctorService, doctorCollection) {
	 	 var highchartsNgConfig, monkey, throwback;
		  console.log($stateParams.id);
		  console.log($scope.doctors.getDoctorById($stateParams.id));
		  $scope.doctor = $scope.doctors.getDoctorById($stateParams.id);

	 console.log("in the DoctorViewController");
	 console.log(monkey);
	 var highchartsNgConfig = {
  "options": {
    "chart": {
      "type": "areaspline"
    },
    "plotOptions": {
      "series": {
        "stacking": ""
      }
    }
  },
  "series": [
    {
      "name": "Patients",
      "data": [
        $scope.doctor["Number of Services"],
		$scope.doctor["Number of Medicare Beneficiaries"],
		$scope.doctor["Number of Medicare Beneficiary/Day Services"],
        7,
        3
      ],
      "id": "series-0"
    },
    {
      "name": "City",
      "data": [
        3,
        1,
        null,
        5,
        2
      ],
      "connectNulls": true,
      "id": "series-1"
    },
    {
      "name": "Specialty",
      "data": [
        5,
        2,
        2,
        3,
        5
      ],
      "type": "column",
      "id": "series-2"
    },
    {
      "name": "Individual",
      "data": [
        1,
        1,
        2,
        3,
        2
      ],
      "type": "column",
      "id": "series-3"
    }
  ],
  "title": {
    "text": $scope.doctors.getDoctorById($stateParams.id).City
  },
  "credits": {
    "enabled": true
  },
  "loading": false,
  "size": {}
};

	$scope.highchartsNgConfig = highchartsNgConfig;
	console.log($scope.doctors.getDoctorById($stateParams.id).City)
  }]);
  
  //Taken from Angular UI bootstrap
  

 
 //TODO:  Fix this to work for multiple word strings
 app.filter('capitalcase', function() {
         return function(input) {
                 return (input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()) || input;
         };
 });
 
 
 app.run(['$rootScope', 'doctorService', 'doctorCollection', function($rootScope, doctorService, doctorCollection) {
	 $rootScope.doctors;
	 $rootScope.getDoctorNumber;
	 doctorCollection.then(function(doctors, getDoctorById) {
		 $rootScope.doctors = doctors;
		 $rootScope.getDoctorNumber = getDoctorById;
		 console.log($rootScope.doctors);
	 });
 	
 }]);
 