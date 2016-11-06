/**
 * Service for working with dictionary api
 */
import app from '../app';

(() => {

    const maxTableParticipants = 12;
    let socket;

    class wsService {
        constructor ($rootScope) {
            this.callbacks = {};

            socket = new WebSocket('wss://js-assignment.evolutiongaming.com/ws_api');

            socket.onopen = () => {
                console.log('Socket is opened...');

                $rootScope.socketIsOpened = true;
                $rootScope.$broadcast('socketOpen');
            };

            socket.onmessage = (message) => {
                const data = JSON.parse(message.data);

                console.log('wsService: Received a message from socket: ', data);

                if (data.$type) {
                    if (this.callbacks[data.$type]) {
                        angular.forEach(this.callbacks[data.$type], (callback) => {
                            callback(data);
                        });

                        console.log(`wsService: Called ${this.callbacks[data.$type].length} callback(s)`);
                    } else {
                        console.log(`wsService: No callbacks for "${data.$type}" message type`);
                    }
                }
            };

            socket.onclose = this.onclose;
            socket.onerror = this.onerror;
        }

        onclose() {
            console.log('Socket was closed.');
        }

        onerror(error) {
            console.log(error);
        }

        send(data) {
            socket.send(JSON.stringify(data));
        }

        subscribeOnMessage(messageApiType, callback) {
            if (!this.callbacks[messageApiType]) {
                this.callbacks[messageApiType] = [];
            }

            this.callbacks[messageApiType].push(callback);
        }

        onTableList(callback) {
            this.subscribeOnMessage('table_list', callback);
        }
        onTableAdded(callback) {
            this.subscribeOnMessage('table_added', callback);
        }

        onTableRemoved(callback) {
            this.subscribeOnMessage('table_removed', callback);
        }

        onTableUpdated(callback) {
            this.subscribeOnMessage('table_updated', callback);
        }

        authorize(username, password) {
            this.send({
                '$type': 'login',
                username,
                password
            });
        }

        ping() {
            this.send({
                '$type': 'ping',
                'seq': 1
            });
        }

        subscribeOnTables() {
            this.send({
                '$type': 'subscribe_tables'
            })
        }

        unsubscribeOnTables() {
            this.send({
                '$type': 'unsubscribe_tables'
            })
        }

        createTable(tableName, participants, afterTableWithId) {
            this.send({
                '$type': 'add_table',
                'after_id': afterTableWithId || -1,
                'table': {
                    'name': tableName,
                    'participants': participants > maxTableParticipants ? maxTableParticipants : participants
                }
            });
        }

        updateTable(tableId, tableName, participants) {
            this.send({
                '$type': 'update_table',
                'table': {
                    'id': tableId,
                    'name': tableName,
                    'participants': participants > maxTableParticipants ? maxTableParticipants : participants
                }
            });
        }

        removeTable(tableId) {
            this.send({
                '$type': 'remove_table',
                id: tableId
            });
        }
    }

    app.service('wsService', ['$rootScope', wsService]);
})();
