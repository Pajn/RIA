import {applyMiddleware, compose, createStore} from 'redux'
import {reactStore} from 'redux-decorated/react'
import {persistStore, autoRehydrate} from 'redux-persist'
import {websocketMiddleware} from 'redux-websocket/lib/client'
import {syncStoreEnhancer} from 'redux-websocket/lib/sync'
import {actions} from 'raxa-common/lib/actions'
import {State} from 'raxa-common/lib/state'
import {websocketClient} from '../app'

const initialState = {
  devices: {},
  deviceClasses: {},
  interfaces: {},
  status: {},
  versions: {},
}

export const store = createStore(state => state, initialState, compose(
  autoRehydrate(),
  syncStoreEnhancer({
    socket: websocketClient,
    keys: ['devices', 'deviceClasses', 'interfaces', 'status'],
    skipVersion: ['status'],
  }),
  applyMiddleware(websocketMiddleware({socket: websocketClient, actions: actions as any})),
  window['devToolsExtension'] ? window['devToolsExtension']() : undefined
))

persistStore(store)

const helpers = reactStore<State>(store)

export const dispatch = helpers.dispatch
export const stateful = helpers.stateful
