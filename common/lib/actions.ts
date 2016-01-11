import {Action as DecoratedAction, createActions} from 'decorated-redux';
import {Device, PluginConfiguration} from './entities';

interface Action<T> extends DecoratedAction<T> {
  meta: {
    toClient?: boolean;
    toServer?: boolean;
  };
}

class Actions {
  deviceAdded: Action<{device: Device}> = {meta: {}};
  deviceUpdated: Action<{device: Device}> = {meta: {}};
  deviceRemoved: Action<{device: Device}> = {meta: {}};

  pluginAdded: Action<{plugin: PluginConfiguration}> = {meta: {toClient: true}};
  pluginUpdated: Action<{plugin: PluginConfiguration}> = {meta: {toClient: true}};
  pluginRemoved: Action<{plugin: PluginConfiguration}> = {meta: {toClient: true}};
}

export const actions = createActions(Actions);
