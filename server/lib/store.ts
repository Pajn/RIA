import nedb from 'nedb-persist';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {reactStore} from 'redux-decorated/react';
import {persistStore, autoRehydrate} from 'redux-persist'
import {websocketMiddleware} from 'redux-websocket/lib/server';
import {syncStoreEnhancer} from 'redux-websocket/lib/sync';
import {actions} from 'raxa-common/lib/actions';
import {State} from 'raxa-common/lib/state';
import {devices} from './reducers/device';
import {webSocketServer} from './websocket';

const finalCreateStore = compose(
  autoRehydrate(),
  syncStoreEnhancer({connection: webSocketServer, whitelist: ['devices']}),
  applyMiddleware(websocketMiddleware({server: webSocketServer, actions}))
)(createStore);

export const store = finalCreateStore(combineReducers({devices, versions: state => state || {}}));
persistStore(store, {storage: nedb({filename: 'db'})});

const helpers = reactStore<State>(store);

export const dispatch = helpers.dispatch;
