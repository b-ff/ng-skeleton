// App configuration & init

const app = angular.module('eg_test', [
    'ui.router'
]);

app.run(['$rootScope', 'wsService', ($rootScope, wsService) => {
    console.log('runned!');

    const authorize = () => {
        wsService.authorize('user1234', 'password1234');
    };

    if ($rootScope.socketIsOpened) {
        authorize();
    } else {
        $rootScope.$on('socketOpen', () => {
            authorize();
        });
    }
}]);

export default app;
