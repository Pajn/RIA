import * as R from 'ramda'
import {createReducer, removeIn, updateIn} from 'redux-decorated'
import {actions} from 'raxa-common/lib/actions'
import {Device, Interface} from 'raxa-common/lib/entities'
import {InterfaceState, StatusState} from 'raxa-common/lib/state'
import {interfaces} from './interface'
import {zipMap} from '../helpers'

const getDefaultValuesForStatus = R.pipe(
  R.prop('status'),
  R.map(R.prop('defaultValue'))
)

const getDefaultStatuses = (device, interfaces) => R.pipe(
  R.prop('interfaces'),
  R.map(id => interfaces[id as any]),
  R.filter(R.prop('status')),
  zipMap(R.prop('id'), getDefaultValuesForStatus)
)(device)

export const status = createReducer<StatusState>({})
  .when(actions.deviceAdded, ({device, interfaces}) =>
      updateIn(device.id, getDefaultStatuses(device, interfaces)))
  .when(actions.deviceRemoved, ({device}) => removeIn(device.id))
  .when(actions.statusUpdated, ({deviceId, interfaceId, status, value}) =>
      updateIn([deviceId, interfaceId, status], value))
