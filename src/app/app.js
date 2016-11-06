// App configuration & init

const app = angular.module('eg_test', [
    'ui.router'
]);

app.run(() => {
    console.log('runned!');
});

export default app;
