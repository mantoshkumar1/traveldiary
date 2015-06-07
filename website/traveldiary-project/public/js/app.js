(function(){
    var App = angular.module('travelDiary', ['ui.router', 'js-data', 'ui.bootstrap']);

    App.factory('Keyword', ['DS',function(DS){
        return DS.defineResource('keyword');
    }])

    App.config(['$stateProvider', 'DSProvider',function($stateProvider, DSProvider){

        DSProvider.defaults.basePath = '/api';

        var add_new_config = {
            url: '/add_movie',
            templateUrl: 'assets/templates/show_all_vacations.html',
            controller: ['$scope', 'Movie', function($scope, Movie){
                $scope.movie = Movie.createInstance();
                $scope.success = false;

                $scope.save = function() {
                    $scope.movie.DSCreate().then(function(){
                        $scope.movie = Movie.createInstance();
                        $scope.success = true;
                    })
                }
            }]
        };

        var show_all_config = {
            url: '/show_all',
            templateUrl: 'assets/templates/all_movies.html',
            resolve: {
                movies: ['Movie', function(Movie){ return Movie.findAll();}]
            },
            controller: ['$scope', 'movies', '$state', function($scope, movies,$state){
                $scope.movies = movies;

                $scope.showDetails = function(movie) {
                    $state.go('show_all.details', {movieId : movie.id})
                }
            }]
        };

        var movie_detail_config = {
            url: '/details/{movieId}',
            templateUrl: 'assets/templates/movie_details.html',
            resolve: {
                movie: ['Movie', '$stateParams', function(Movie, $stateParams){

                    return Movie.find($stateParams.movieId);
                }]
            },
            controller: ['$scope', 'movie', '$state', function($scope, movie, $state){
                $scope.movie = movie;

                $scope.update = function() {
                    movie.DSSave();
                }
                $scope.delete = function() {
                    movie.DSDestroy().then(function(){
                        $state.go('show_all');
                    });
                }
            }]

        }
        $stateProvider.state('add_movie', add_new_config);
        $stateProvider.state('show_all', show_all_config);
        $stateProvider.state('show_all.details', movie_detail_config);
    }]);

    App.filter('boolHuman', function(){
        return function(input) {
            return input ? 'Yes':'No';
        }
    });

    App.directive('editText', function(){

        return {
            restrict: 'E',
            scope: {
                value : '='
            },
            require: 'value',
            controller: ['$scope', function($scope){
                $scope.editing = false;
                $scope.toggleEdit = function(save) {
                    if (!$scope.editing) {
                        $scope.editing = true;
                    } else {
                        if (save) {
                            $scope.$parent.update();
                        }
                        $scope.editing = false;
                    }
                }
            }],
            templateUrl: 'assets/templates/edit_text.html'
        };
    });
    App.directive('editBool', function() {
        return {
            restrict: 'E',
            scope: {
                value: '='
            },
            require:'value',
            controller: ['$scope', function($scope){
                $scope.toggleValue = function(){
                    $scope.value = !($scope.value);
                    //seems to be a bug on js-data, needs a new run loop apparently
                    window.setTimeout(function() { $scope.$parent.update();}, 1);

                }
            }],
            templateUrl: 'assets/templates/edit_bool.html'
        };
    });

    App.controller('searchController', ['$scope', 'Keyword', function($scope, Keyword){
        $scope.currentKeyword = undefined;
        var keywords = Keyword.findAll();
        console.log(keywords);
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
