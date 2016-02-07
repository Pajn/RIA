import {createReducer, removeIn, updateIn} from 'redux-decorated';
import {actions} from 'raxa-common/lib/actions';
import {DeviceClassState} from 'raxa-common/lib/state';
import {deleteByProperty} from '../helpers';

export const deviceClasses = createReducer<DeviceClassState>({
  "Serial MySensors Gateway": {
    "id": "Serial MySensors Gateway",
  "name": "Serial MySensors Gateway",
    "config": {
    "serialPort": {
      "type": "string"
    }
  },
    "plugin": "MySensors",
  "interfaces": ["MySensors Gateway"]
},
  "MySensors Node" : {
  "id": "MySensors Node",
  "name": "MySensors Node",
    "plugin": "MySensors",
  "config": {
  "gateway": {
    "type": "integer"
  },
  "nodeId": {
    "type": "integer"
  }
},
  "interfaces": ["MySensors Gateway"]
}})
  .when(actions.deviceClassAdded, ({deviceClass}) =>
      updateIn(deviceClass.id, deviceClass))
  .when(actions.deviceClassUpdated, ({deviceClass}) =>
      updateIn(deviceClass.id, deviceClass))
  .when(actions.deviceClassRemoved, ({deviceClass}) =>
      removeIn(deviceClass.id))
  .when(actions.pluginRemoved, deleteByProperty('plugin'))
  .build();
