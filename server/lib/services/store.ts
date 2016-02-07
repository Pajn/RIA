import nedb from 'nedb-persist';
import {applyMiddleware, combineReducers, compose, createStore, Store} from 'redux';
import {Action} from 'redux-decorated';
import {reactStore} from 'redux-decorated/react';
import {persistStore, autoRehydrate} from 'redux-persist';
import {websocketMiddleware} from 'redux-websocket/lib/server';
import {syncStoreEnhancer} from 'redux-websocket/lib/sync';
import {actions} from 'raxa-common/lib/actions';
import {Service} from 'raxa-common/lib/entities';
import {State} from 'raxa-common/lib/state';
import {devices} from './../reducers/device';
import {deviceClasses} from './../reducers/device-class';
import {interfaces} from './../reducers/interface';
import {plugins} from './../reducers/plugin';
import {setGetInterfaces, status} from './../reducers/status';
import {webSocketServer} from './websocket';

export let store: Store;
export let dispatch: <T>(action: Action<T>, payload?: T) => void;

export const storeService: Service = {
  start() {

    const reducer = combineReducers({
      devices,
      deviceClasses,
      interfaces,
      plugins,
      status,
      versions: state => state || {}
    });

    const finalCreateStore = compose(
      autoRehydrate(),
      syncStoreEnhancer({
        connection: webSocketServer,
        keys: ['devices', 'deviceClasses', 'interfaces', 'status'],
        skipVersion: ['status'],
      }),
      applyMiddleware(websocketMiddleware({server: webSocketServer, actions}))
    )(createStore);

    store = finalCreateStore(reducer);

    setGetInterfaces(() => store.getState().interfaces);

    const helpers = reactStore<State>(store);

    dispatch = helpers.dispatch;

    return new Promise(resolve => {
      persistStore(store, {storage: nedb({filename: 'db'})}, resolve);
    });
  },

  stop() {},
};
