(function(){
    var App = angular.module('travelDiary', ['ui.router', 'js-data', 'ui.bootstrap']);

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
            templateUrl: 'assets/templates/index.html',
            controller: [function() {}]
        }

        var search_vacation_config = {
            url: '/search_vacations/{keyString}',
            templateUrl: 'assets/templates/search_vacation.html',
            // Resolves the Promise Object.
            resolve: {
                keywords: ['$q','Keyword',function ($q,Keyword) {
                    // Is this a hack?
                    var defer = $q.defer();
                    var unresolved = Keyword.findAll();
                    defer.resolve(unresolved);
                    // End hack?
                    return defer.promise; }],
                vacations: [ '$q', 'Vacation', '$stateParams', function ($q, Vacation,  $stateParams) {
                    // Is this a hack?
                    var defer = $q.defer();
                    var unresolved = Vacation.find($stateParams.keyString);
                    defer.resolve(unresolved);
                    // End hack?
                    return defer.promise; }]
            },
            controller: ['$scope', 'keywords', 'vacations', '$state', function($scope, keywords, vacations, $state){
                // Binds the variables from the resource, e.g. /api/vacations, to the scope variables.
                $scope.keywords = keywords;
                $scope.vacations = vacations;

                console.log(keywords);
                console.log(vacations);
            }]
        };

        // Adds the config as a state.
        $stateProvider.state('default', index_config);
        $stateProvider.state('search_vacation_config', search_vacation_config);
    }]);

    var controller = App.controller('searchController', ['$scope', 'Keyword', '$state', function($scope, Keyword, $state){
        $scope.currentKeyword = undefined;
        $scope.keywordList = Keyword.findAll();
     //   $scope.keywordList = [];
      /* for(k in keywords){
            $scope.keywordList.push(k);
        }*/
        $scope.searchList = [];

        $scope.addKeyword = function(newKeyword){
            if(newKeyword != undefined) {
                console.log("keyword.id="+newKeyword.id);
                if(!containsKeyword($scope.searchList, newKeyword)){
                    $scope.searchList.push(newKeyword);
                }
                //$scope.keywordList.splice($scope.keywordList.indexOf(newKeyword), 1);
               // $scope.keywordList = $scope.keywordList.filter( function(el) { return el.id != newKeyword.id; });
                //$scope.keywordList.remove($scope.keywordList.indexOf(newKeyword).id);
                $scope.currentKeyword = undefined;

                keyStr = ''

                $scope.searchList.forEach(function (keyword) {
                    keyStr += keyword.keyword;
                });

                $state.go('search_vacation_config', {keyString: keyStr});
            }
        };

        $scope.removeKeyword = function(newKeyword){
            if(newKeyword != undefined) {
                if(containsKeyword($scope.searchList, newKeyword)){
                    var index = $scope.searchList.indexOf(newKeyword);
                    $scope.searchList.splice(index, 1);
                }
            }
        };

        var containsKeyword = function(list, keyword){
            var found = false;
            for(var i = 0; i < list.length; i++) {
                if (list[i].id == keyword.id) {
                    found = true;
                    break;
                }
            }
            return found;
        };

        $scope.getSearchFilter = function($viewValue) {
            console.log("entered searchFilter");
            var matching = [];
            console.log($scope.keywordList);
            console.log($scope.keywordList.length);
            for (var i=0; i < $scope.keywordList.length; i++) {
                console.log($scope.keywordList[i].keyword);
                if ($scope.keywordList[i].keyword.toLowerCase().indexOf($viewValue.toLowerCase()) != -1){
                    matching.push($scope.stuffs[i]);
                }
            }
            console.log(matching);
            return matching;
        }
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
})();
