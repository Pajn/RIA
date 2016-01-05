import {createReducer, removeIn, updateIn} from 'decorated-redux';
import {actions} from 'raxa-common/lib/actions';
import {DeviceState} from 'raxa-common/lib/state';

export const devices = createReducer<DeviceState>({})
  .when(actions.deviceAdded, (state, {device}) => console.log('add') || updateIn(device.id, device, state))
  .when(actions.deviceUpdated, (state, {device}) => updateIn(device.id, device, state))
  .when(actions.deviceRemoved, (state, {device}) => removeIn(device.id, state))
  .when(actions.syncState, (state, newState) => newState.devices || state)
  .build();
