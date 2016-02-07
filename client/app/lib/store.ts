import {applyMiddleware, compose, createStore} from 'redux';
import {reactStore} from 'redux-decorated/react';
import {persistStore, autoRehydrate} from 'redux-persist';
import {websocketMiddleware} from 'redux-websocket/lib/client';
import {syncStoreEnhancer} from 'redux-websocket/lib/sync';
import {State} from 'raxa-common/lib/state';
import {websocketClient} from './websocket';

const initialState = {
  devices: {},
  deviceClasses: {},
  interfaces: {},
  status: {},
  versions: {},
};

const finalCreateStore = compose(
  autoRehydrate(),
  syncStoreEnhancer({
    connection: websocketClient,
    keys: ['devices', 'deviceClasses', 'interfaces', 'status'],
    skipVersion: ['status'],
  }),
  applyMiddleware(websocketMiddleware(websocketClient))
)(createStore);

export const store = finalCreateStore(state => state, initialState);
persistStore(store);

const helpers = reactStore<State>(store);

export const dispatch = helpers.dispatch;
export const stateful = helpers.stateful;
