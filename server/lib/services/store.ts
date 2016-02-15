import nedb from 'nedb-persist'
import {applyMiddleware, combineReducers, compose, createStore, Store} from 'redux'
import {Action} from 'redux-decorated'
import {reactStore} from 'redux-decorated/react'
import {persistStore, autoRehydrate} from 'redux-persist'
import {websocketMiddleware} from 'redux-websocket/lib/server'
import {syncStoreEnhancer, noopReducer} from 'redux-websocket/lib/sync'
import {actions} from 'raxa-common/lib/actions'
import {Service} from 'raxa-common/lib/entities'
import {State} from 'raxa-common/lib/state'
import {devices} from './../reducers/device'
import {deviceClasses} from './../reducers/device-class'
import {interfaces} from './../reducers/interface'
import {plugins} from './../reducers/plugin'
import {status} from './../reducers/status'
import {webSocketServer} from './websocket'

export let store: Store
export let dispatch: <T>(action: Action<T>, payload?: T) => void

export const storeService: Service = {
  start() {

    const reducer = combineReducers({
      devices,
      deviceClasses,
      interfaces,
      plugins,
      status,
      versions: noopReducer,
    })

    store = createStore(reducer, compose(
      autoRehydrate(),
      syncStoreEnhancer({
        socket: webSocketServer,
        keys: ['devices', 'deviceClasses', 'interfaces', 'status'],
        skipVersion: ['status'],
      }),
      applyMiddleware(websocketMiddleware({socket: webSocketServer, actions: actions as any}))
    ))

    const helpers = reactStore<State>(store)

    dispatch = helpers.dispatch

    return new Promise(resolve => {
      persistStore(store, {storage: nedb({filename: 'db'})}, resolve)
    })
  },

  stop() {},
}
