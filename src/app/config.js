/**
 * App configuration & routing
 *
 * @param $stateProvider
 * @param $urlRouterProvider
 * @param $locationProvider
 */

import app from './app';

const config = ($stateProvider, $urlRouterProvider, $locationProvider) => {

    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/index');

    $stateProvider
        .state('index', {
            title: 'Index',
            url: '/index',
            template: require('../public/views/index.jade')()
        })
        .state('credits', {
            title: 'Credits',
            url: '/credits',
            template: require('../public/views/credits.jade')()
        });
};

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    config
]);
