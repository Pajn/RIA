import * as R from 'ramda';
import {createReducer, removeIn, updateIn} from 'redux-decorated';
import {actions} from 'raxa-common/lib/actions';
import {InterfaceState, StatusState} from 'raxa-common/lib/state';

let getInterfaces: () => InterfaceState;

export function setGetInterfaces(fn: () => InterfaceState) {
  getInterfaces = fn;
}

export const status = createReducer<StatusState>({})
  .when(actions.deviceAdded, ({device}) => {
    const interfaces = getInterfaces();
    const statuses = device.interfaces
        .map(id => interfaces[id])
        .filter(iface => !!iface.status)
        .reduce((statuses, iface) => {
          statuses[iface.id] = R.map(R.prop('defaultValue'), iface.status);

          return statuses;
        }, {});

    return updateIn(device.id, statuses);
  })
  .when(actions.deviceRemoved, ({device}) => removeIn(device.id))
  .when(actions.statusUpdated, ({deviceId, interfaceId, status, value}) =>
      updateIn([deviceId, interfaceId, status], value))
  .build();
