import {createReducer, removeIn, updateIn} from 'redux-decorated'
import {actions} from 'raxa-common/lib/actions'
import {defaultInterfaces} from 'raxa-common/lib/default-interfaces'
import {InterfaceState} from 'raxa-common/lib/state'
import {deleteByProperty} from '../helpers'

const initialState = defaultInterfaces.reduce((interfaces, iface) => {
  interfaces[iface.id] = iface
  return interfaces
}, {}) as any

export const interfaces = createReducer<InterfaceState>(initialState)
  .when(actions.interfaceAdded, ({iface}) => updateIn(iface.id, iface))
  .when(actions.interfaceUpdated, ({iface}) => updateIn(iface.id, iface))
  .when(actions.interfaceRemoved, ({iface}) => removeIn(iface.id))
  .when(actions.pluginRemoved, deleteByProperty('plugin'))
