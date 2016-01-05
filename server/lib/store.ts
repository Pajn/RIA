import {reactStore} from 'decorated-redux/react';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
// import {persistStore, autoRehydrate} from 'redux-persist'
import {websocketMiddleware} from 'websocket-redux/lib/server';
import {devices} from './reducers/device';
import {actions} from 'raxa-common/lib/actions';
import {State} from 'raxa-common/lib/state';
import {webSocketServer} from './websocket';

const finalCreateStore = compose(
  // autoRehydrate(),
  applyMiddleware(websocketMiddleware({server: webSocketServer, actions}))
)(createStore);

export const store = finalCreateStore(combineReducers({devices}));
// persistStore(store);

const helpers = reactStore<State>(store);

export const dispatch = helpers.dispatch;
