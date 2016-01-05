'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.devices = undefined;

var _decoratedRedux = require('decorated-redux');

var _actions = require('raxa-common/lib/actions');

var devices = exports.devices = (0, _decoratedRedux.createReducer)({ nextId: 1 }).when(_actions.actions.deviceAdded, function (state, _ref) {
    var device = _ref.device;

    state = (0, _decoratedRedux.updateIn)('nextId', state.nextId + 1, state);
    return (0, _decoratedRedux.updateIn)(device.id, device, state);
}).when(_actions.actions.deviceUpdated, function (state, _ref2) {
    var device = _ref2.device;
    return (0, _decoratedRedux.updateIn)(device.id, device, state);
}).when(_actions.actions.deviceRemoved, function (state, _ref3) {
    var device = _ref3.device;
    return (0, _decoratedRedux.removeIn)(device.id, state);
}).when(_actions.actions.syncState, function (state, newState) {
    return newState.devices || state;
}).build();