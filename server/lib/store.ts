import {reactStore} from 'decorated-redux/react';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
// import {persistStore, autoRehydrate} from 'redux-persist'
import {trackVersion} from 'versioned-redux';
import {websocketMiddleware} from 'websocket-redux/lib/server';
import {syncStoreEnhancer} from 'websocket-redux/lib/sync';
import {actions} from 'raxa-common/lib/actions';
import {State} from 'raxa-common/lib/state';
import {devices} from './reducers/device';
import {webSocketServer} from './websocket';

// console.log(syncStoreEnhancer);

const finalCreateStore = compose(
  // autoRehydrate(),
  syncStoreEnhancer({connection: webSocketServer, whitelist: ['devices']}),
  applyMiddleware(websocketMiddleware({server: webSocketServer, actions}))
)(createStore);

export const store = finalCreateStore(combineReducers({devices, versions: state => state || {}}));
// persistStore(store);

const helpers = reactStore<State>(store);

export const dispatch = helpers.dispatch;
