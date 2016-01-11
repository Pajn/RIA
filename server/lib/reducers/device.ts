import {createReducer, removeIn, updateIn} from 'decorated-redux';
import {actions} from 'raxa-common/lib/actions';
import {DeviceState} from 'raxa-common/lib/state';

export const devices = createReducer<DeviceState & {nextId: number}>({nextId: 1})
  .when(actions.deviceAdded, (state, {device}) => {
    state = updateIn('nextId', state.nextId + 1, state);
    return updateIn(device.id, device, state);
  })
  .when(actions.deviceUpdated, (state, {device}) => updateIn(device.id, device, state))
  .when(actions.deviceRemoved, (state, {device}) => removeIn(device.id, state))
  .build();
