'use strict';

require('babel-polyfill');

var _http = require('http');

var http = _interopRequireWildcard(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _requireDir = require('require-dir');

var _requireDir2 = _interopRequireDefault(_requireDir);

var _websocket = require('./websocket');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var app = (0, _express2.default)();
var server = http.createServer(app);
app.get('/', function (req, res) {
    res.render('index', { layout: false });
});
server.listen(8080);
(0, _websocket.createWebSocketServer)(server);
(0, _requireDir2.default)('./remote-procedures/');