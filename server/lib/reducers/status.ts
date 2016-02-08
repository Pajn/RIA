import * as R from 'ramda';
import {createReducer, removeIn, updateIn} from 'redux-decorated';
import {actions} from 'raxa-common/lib/actions';
import {Device, Interface} from 'raxa-common/lib/entities';
import {InterfaceState, StatusState} from 'raxa-common/lib/state';
import {zipMap} from '../helpers';

let getInterface: (id) => Interface;

export function setGetInterfaces(fn: () => InterfaceState) {
  getInterface = (id) => fn()[id];
}

const getStatusDefaultValues: (iface: Interface) => any = R.pipe(
  R.prop('status'),
  R.map(R.prop('defaultValue'))
);

const getDefaultStatuses: (device: Device) => any = R.pipe(
  R.prop('interfaces'),
  R.map(id => getInterface(id)),
  R.filter(R.prop('status')),
  zipMap(R.prop('id'), getStatusDefaultValues)
);

export const status = createReducer<StatusState>({})
  .when(actions.deviceAdded, ({device}) => updateIn(device.id, getDefaultStatuses(device)))
  .when(actions.deviceRemoved, ({device}) => removeIn(device.id))
  .when(actions.statusUpdated, ({deviceId, interfaceId, status, value}) =>
      updateIn([deviceId, interfaceId, status], value))
  .build();
