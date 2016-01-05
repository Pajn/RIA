'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.plugins = undefined;

var _decoratedRedux = require('decorated-redux');

var _actions = require('raxa-common/lib/actions');

var plugins = exports.plugins = (0, _decoratedRedux.createReducer)({}).when(_actions.actions.pluginAdded, function (state, _ref) {
    var plugin = _ref.plugin;
    return (0, _decoratedRedux.updateIn)(plugin.id, plugin, state);
}).when(_actions.actions.pluginUpdated, function (state, _ref2) {
    var plugin = _ref2.plugin;
    return (0, _decoratedRedux.updateIn)(plugin.id, plugin, state);
}).when(_actions.actions.pluginRemoved, function (state, _ref3) {
    var plugin = _ref3.plugin;
    return (0, _decoratedRedux.removeIn)(plugin.id, state);
}).when(_actions.actions.syncState, function (state, newState) {
    return newState.plugins || state;
}).build();