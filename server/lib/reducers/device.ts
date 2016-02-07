import {createReducer, clone, removeIn, updateIn} from 'redux-decorated';
import {actions} from 'raxa-common/lib/actions';
import {DeviceState} from 'raxa-common/lib/state';
import {deleteByProperty} from '../helpers';

type State = DeviceState & {nextId: number};

export const devices = createReducer<State>({nextId: 1})
  .when(actions.deviceAdded, (state: State, {device}) => {
    state = updateIn('nextId', state.nextId + 1, state);
    return updateIn(device.id, device, state);
  })
  .when(actions.deviceUpdated, ({device}) => updateIn(device.id, device))
  .when(actions.deviceRemoved, ({device}) => removeIn(device.id))
  .when(actions.deviceClassRemoved, deleteByProperty('deviceClass'))
  .when(actions.pluginRemoved, deleteByProperty('plugin'))
  .build();
