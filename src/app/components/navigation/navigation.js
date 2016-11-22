import app from '../../app';

class navComponentCtrl {
    constructor($state) {
        this.availableStates = $state.get().filter((item) => !item.abstract && !item.noNavigationLink);
    }
}

navComponentCtrl.$inject = ['$state'];

app.component('navigation', {
    controller: navComponentCtrl,
    controllerAs: 'ctrl',
    template: require('./navigation.jade')()
});
