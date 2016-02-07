import {Action as DecoratedAction, createActions} from 'redux-decorated';
import {Device, DeviceClass, Interface, PluginConfiguration} from './entities';

export interface Action<T> extends DecoratedAction<T> {
  meta?: {
    toClient?: boolean;
    toServer?: boolean;
  };
}

class Actions {
  deviceAdded: Action<{device: Device}> = {};
  deviceUpdated: Action<{device: Device}> = {};
  deviceRemoved: Action<{device: Device}> = {};

  deviceClassAdded: Action<{deviceClass: DeviceClass}> = {};
  deviceClassUpdated: Action<{deviceClass: DeviceClass}> = {};
  deviceClassRemoved: Action<{deviceClass: DeviceClass}> = {};

  interfaceAdded: Action<{iface: Interface}> = {};
  interfaceUpdated: Action<{iface: Interface}> = {};
  interfaceRemoved: Action<{iface: Interface}> = {};

  pluginAdded: Action<{plugin: PluginConfiguration}> = {};
  pluginUpdated: Action<{plugin: PluginConfiguration}> = {};
  pluginRemoved: Action<{plugin: PluginConfiguration}> = {};

  statusUpdated: Action<{
    deviceId: number,
    interfaceId: string,
    status: string,
    value: any,
  }> = {};
}

export const actions = createActions(Actions);
