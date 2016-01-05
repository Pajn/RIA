'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.webSocketServer = undefined;
exports.createWebSocketServer = createWebSocketServer;

var _server = require('websocket-redux/lib/server');

var _server2 = require('websocket-redux/lib/rpc/server');

var webSocketServer = exports.webSocketServer = undefined;
function createWebSocketServer(server) {
    exports.webSocketServer = webSocketServer = new _server.WebSocketServer(server);
    (0, _server2.useWebSocketServer)(webSocketServer);
}