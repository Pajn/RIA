'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatch = exports.store = undefined;

var _react = require('decorated-redux/react');

var _redux = require('redux');

var _server = require('websocket-redux/lib/server');

var _device = require('./reducers/device');

var _actions = require('raxa-common/lib/actions');

var _websocket = require('./websocket');

var finalCreateStore = (0, _redux.compose)(
// autoRehydrate(),
(0, _redux.applyMiddleware)((0, _server.websocketMiddleware)({ server: _websocket.webSocketServer, actions: _actions.actions })))(_redux.createStore);
var store = exports.store = finalCreateStore((0, _redux.combineReducers)({ devices: _device.devices }));
// persistStore(store);
var helpers = (0, _react.reactStore)(store);
var dispatch = exports.dispatch = helpers.dispatch;