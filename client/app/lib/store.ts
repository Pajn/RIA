import {reactStore} from 'decorated-redux/react';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist'
import {websocketMiddleware} from 'websocket-redux/lib/client';
import {devices} from './reducers/device';
import {plugins} from './reducers/plugin';
import {State} from 'raxa-common/lib/state';
import {websocketClient} from './websocket';

const finalCreateStore = compose(
  autoRehydrate(),
  applyMiddleware(websocketMiddleware(websocketClient))
)(createStore);

export const store = finalCreateStore(combineReducers({devices, plugins}));
persistStore(store);

const helpers = reactStore<State>(store);

export const dispatch = helpers.dispatch;
export const stateful = helpers.stateful;
