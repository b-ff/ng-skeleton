/**
 * App configuration & routing
 *
 * @param $stateProvider
 * @param $urlRouterProvider
 * @param $locationProvider
 */

import app from './app';

const config = ($stateProvider, $urlRouterProvider, $locationProvider) => {

    // $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/tables');

    $stateProvider
        .state('auth', {
            url: '/auth',
            template: require('../public/views/auth.jade')()
        })
        .state('tables', {
            url: '/tables',
            template: require('../public/views/tables.jade')()
        });
};

app.config([
    '$stateProvider', '$urlRouterProvider',
    '$locationProvider', config]);
