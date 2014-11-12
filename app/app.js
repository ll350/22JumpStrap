'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'ui.router'
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

    });
});


// config(['$routeProvider', function($routeProvider) {
//   $routeProvider.otherwise({redirectTo: '/view1'});
// }]);



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
      //test
      //return {name: "test doctor"};
     
}]);
 
//angular.module('myApp',[]).controller('doctorListController', ['$scope', function($scope) {
       
app.controller('doctorListController',  ['$stateParams', '$scope', 'doctorService', '$state', function($stateParams, $scope, doctorService, $state) {
        $scope.messages = ["no messages"];
          $scope.doctors = ["no data"];
		  $scope.showSide = false;
          $scope.choosen_doctor = {};
          doctorService.getDoctors().then(function(data) {
                  if(data != null && data.data.length > 0) {
                          console.log("it's real");
                  }
                  // for (var doctor in data[0]) {
                  //                      console.log(doctor);
                  //                      $scope.doctors.push(doctor);
                  // }
                  $scope.doctors = data.data;
          },
      function(){
                  console.log("The call to the doctorService gets rejected");
          });
         
          //Well need to move this later
          $scope.choosenDoctor = function(doc) {
                  var docID = doc._id.$oid;
                  $scope.choosen_doctor = doc;
                  $scope.choosen_doctor = docID;
                  console.log(doc._id);
                  //console.log(doc.id);
               
          }
          //TEST function
          //TODO: delete
          $scope.getDoctorDatabaseID = function(doc) {
                  return doc._id.$oid;
          }
          //TEST function
          //TODO: delete
          $scope.getDoctorServiceID = function(doc) {
                  return doc.id;
          }
         
          $scope.singleDoctorLink = function(doc) {
                  //return "docs/" + $stateParams.id;
                  return "docs/" + doc._id.$oid;
          }
         
 
 }]);
 
app.controller('doctorTronController',  ['$stateParams', '$scope', 'doctorService', '$state', function($stateParams, $scope, doctorService, $state) {
  $scope.newDoctor = function() {
         console.log("requested a new doctor");
        }
       
        $scope.singleDoctor = doctorService.getDoctorByID($stateParams.id);
  }]);
 
 
 //TODO:  Fix this to work for multiple word strings
 app.filter('capitalcase', function() {
         return function(input) {
                 return (input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()) || input;
         };
 });