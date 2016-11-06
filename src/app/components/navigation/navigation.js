import app from '../../app';

class navComponentCtrl {
    constructor($state) {
        this.state = $state;
    }

    goToTables() {
        this.state.go('tables');
    }

    goToAuth() {
        this.state.go('auth');
    }
}

navComponentCtrl.$inject = ['$state'];

app.component('navigation', {
    controller: navComponentCtrl,
    controllerAs: 'ctrl',
    template: require('./navigation.jade')()
});