import app from '../../app';

class TableListController {
    constructor($window, $rootScope, wsService) {
        this.wsService = wsService;

        this.isFormShowed = false;

        this.form = {
            id: null,
            name: '',
            participants: null,
            afterId: null
        };

        this.tables = [];

        if (!$window.localStorage.getItem('tableListSubscribed')) {
            if ($rootScope.socketIsOpened) {
                this.subscribeOnTables();
            } else {
                $rootScope.$on('socketOpen', () => {
                    this.subscribeOnTables();
                });
            }

            this.wsService.onTableList((data) => {
                this.onTableListUpdated(data);
                $rootScope.$apply();
            });

            this.wsService.onTableAdded((data) => {
                this.onTableAdded(data);
                $rootScope.$apply();
            });

            this.wsService.onTableRemoved((data) => {
                this.onTableRemoved(data);
                $rootScope.$apply();
            });

            $window.localStorage.setItem('tableListSubscribed', true);
        }
    }

    subscribeOnTables() {
        this.wsService.subscribeOnTables();
        console.log('subscribed!');
    }

    addDisplayedParticipants(tables) {
        tables.map((table) => angular.extend(table, {
            displayedParticipants: Array.from(Array(table.participants).keys())
        }));
    }

    onTableListUpdated(data) {
        let tables = data.tables;
        this.addDisplayedParticipants(tables);
        this.tables = tables;
    }

    onTableAdded(data) {
        let newTablesList = [];

        if (data.after_id >= 0) {
            let previousTableIndex = this.findTableIndexById(data.after_id);

            newTablesList = this.tables.slice(0, previousTableIndex + 1)
                .concat(data.table)
                .concat(this.tables.slice(previousTableIndex + 2 , this.tables.length));
        } else {
            newTablesList = newTablesList.concat(data.table).concat(this.tables);
        }

        this.tables = newTablesList;
    }

    onTableUpdated(data) {
        let tableIndex = this.findTableIndexById(data.id);
        this.tables[tableIndex] = data.table;
    }

    onTableRemoved(data) {
        this.tables.splice(this.findTableIndexById(data.id), 1);
    }

    findTableIndexById(tableId) {
        let index = 0;

        while (this.tables[index].id !== tableId && index < this.tables.length) {
            index++;
        }

        return index;
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

TableListController.$inject = ['$window', '$rootScope', 'wsService'];

app.component('tableList', {
    controller: TableListController,
    controllerAs: 'ctrl',
    template: require('./table-list.jade')()
});