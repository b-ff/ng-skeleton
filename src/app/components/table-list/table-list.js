import app from '../../app';

class TableListController {
    constructor($rootScope, wsService) {
        this.wsService = wsService;

        this.isFormShowed = false;

        this.form = {
            id: null,
            name: '',
            participants: null,
            afterId: null
        };

        this.tables = [];

        for (let i = 1; i < 20; i++) {
            this.tables.push({
                id: i,
                name: `Example table #${i}`,
                participants: 12
            })
        }

        if ($rootScope.socketIsOpened) {
            this.subscribeOnTables();
        } else {
            const self = this;

            $rootScope.$on('socketOpen', () => {
                self.subscribeOnTables();
            });
        }
    }

    subscribeOnTables() {
        this.wsService.subscribeOnTables();
        console.log('subscribed!');
    }

    showForm() {
        this.isFormShowed = true;
    }

    submit() {
        if (this.form.id) {
            this.wsService.updateTable(this.form.id, this.form.name, this.form.participants);
        } else {
            this.wsService.createTable(this.form.name, this.form.participants, this.form.afterId);
        }
    }

    cancel() {
        this.isFormShowed = false;
        this.form.id = null;
        this.form.name = '';
        this.form.participants = null;
        this.form.afterId = null;
    }

    update(table) {
        this.form = angular.extend(this.form, table);
        this.isFormShowed = true;
    }

    remove(table) {
        this.wsService.removeTable(table.id);
    }
}

TableListController.$inject = ['$rootScope', 'wsService'];

app.component('tableList', {
    controller: TableListController,
    controllerAs: 'ctrl',
    template: require('./table-list.jade')()
});