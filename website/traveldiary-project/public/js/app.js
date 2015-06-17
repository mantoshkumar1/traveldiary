var App = angular.module('travelDiary', ['ui.router', 'js-data', 'ui.bootstrap', 'angular.filter','ngMaterial']);

App.factory('Keyword', ['DS',function(DS){
    return DS.defineResource('keyword');
}]);

App.factory('Vacation', ['DS',function(DS){
    return DS.defineResource('vacation');
}]);

App.config(['$stateProvider', 'DSProvider',function($stateProvider, DSProvider){
    DSProvider.defaults.basePath = '/api';

    var index_config = {
        url: '',
        views: {
            'navigation': {
                templateUrl: 'assets/templates/navigation.html',
                resolve: {
                    keywords: ['Keyword',function (Keyword) {
                        return Keyword.findAll();
                    }],
                    selectedKeywords: ['Keyword', '$stateParams', function (Keyword, $stateParams) {
                        return []; // Injects zero keywords
                    }]
                },
                controller: 'navigationController'
            },
            'content': {
                templateUrl: 'assets/templates/index.html',
                resolve : {
                    vacations: [ 'Vacation', function (Vacation) {
                        return Vacation.findAll(); }]
                },
                controller: [ '$scope', 'vacations' , function ($scope, vacations) {
                    $scope.vacations = vacations;
                }] // Empty controller
            }
        }
    };

    var search_vacation_config = {
        url: '/search_vacations/{keyString}',
        views: {
            'navigation': {
                templateUrl: 'assets/templates/navigation.html',
                resolve: {
                    keywords: ['Keyword',function (Keyword) {
                        return Keyword.findAll();
                    }],
                    selectedKeywords: ['Keyword', '$stateParams', function (Keyword, $stateParams) {
                        return Keyword.find($stateParams.keyString);
                    }]
                },
                controller: 'navigationController'
            },
            'content': {
                templateUrl: 'assets/templates/search_vacation.html',
                resolve : {
                    vacations: [ 'Vacation', '$stateParams', function (Vacation,  $stateParams) {
                        return Vacation.find($stateParams.keyString); }]
                },
                controller: 'vacationSearchController'
            }
        }
    }

    var vacation_details_config = {
        url: '/vacation_details',
        views: {
            'navigation': {
                templateUrl: 'assets/templates/navigation.html',
                resolve: {
                    keywords: ['Keyword',function (Keyword) {
                        return Keyword.findAll();
                    }],
                    selectedKeywords: ['Keyword', '$stateParams', function (Keyword, $stateParams) {
                        return []; // Injects zero keywords
                    }]
                },
                controller: 'navigationController'
            },
            'content': {
                templateUrl: 'assets/templates/vacation_details.html',
                resolve : {
                    vacations: [ 'Vacation', function (Vacation) {
                        return Vacation.findAll(); }]
                },
                controller: [ '$scope', 'vacations' , function ($scope, vacations) {
                    $scope.vacations = vacations;
                    $scope.vacation = vacations[0];
                    $scope.imagePath = "assets/images/1.jpg"
                    console.log($scope.vacation);
                }] // Empty controller
            }
        }
    };

    // Adds the config as a state.
    $stateProvider.state('default', index_config);
    $stateProvider.state('search_vacation_config', search_vacation_config);
    $stateProvider.state('vacation_details_config', vacation_details_config);
}]);

App.controller('vacationSearchController', [ '$scope', 'vacations', function($scope, vacations) {
    // Add vacations to scope for displaying the content in search_vacation.html
    $scope.vacations = vacations;
}]);

App.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
