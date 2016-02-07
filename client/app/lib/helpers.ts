import {store} from './store';

export function getStatus(deviceId, interfaceId, statusId) {
  const {status} = store.getState();

  if (!status[deviceId]) return undefined;
  if (!status[deviceId][interfaceId]) return undefined;

  return status[deviceId][interfaceId][statusId];
}
