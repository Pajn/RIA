'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.webSocketServer = undefined;

require('babel-polyfill');

var _http = require('http');

var http = _interopRequireWildcard(_http);

var _express = require('express');

var express = _interopRequireWildcard(_express);

var _requireDir = require('require-dir');

var requireDir = _interopRequireWildcard(_requireDir);

var _server = require('websocket-redux/lib/server');

var _server2 = require('websocket-redux/lib/rpc/server');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var app = express();
var server = http.createServer(app);
app.get('/', function (req, res) {
    res.render('index', { layout: false });
});
server.listen(8080);
var webSocketServer = exports.webSocketServer = new _server.WebSocketServer(server);
(0, _server2.useWebSocketServer)(webSocketServer);
requireDir('./remote-procedures/');