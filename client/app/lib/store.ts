import {applyMiddleware, compose, createStore} from 'redux';
import {reactStore} from 'redux-decorated/react';
import {persistStore, autoRehydrate} from 'redux-persist';
import {websocketMiddleware} from 'redux-websocket/lib/client';
import {syncStoreEnhancer} from 'redux-websocket/lib/sync';
import {State} from 'raxa-common/lib/state';
import {websocketClient} from './websocket';

const finalCreateStore = compose(
  autoRehydrate(),
  syncStoreEnhancer({connection: websocketClient, whitelist: ['devices']}),
  applyMiddleware(websocketMiddleware(websocketClient))
)(createStore);

export const store = finalCreateStore(state => state, {devices: {}, versions: {}});
persistStore(store);

const helpers = reactStore<State>(store);

export const dispatch = helpers.dispatch;
export const stateful = helpers.stateful;
