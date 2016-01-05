import {Action as DecoratedAction, createActions} from 'decorated-redux';
import {Device, PluginConfiguration} from './entities';

interface Action<T> extends DecoratedAction<T> {
  meta: {
    toClient?: boolean;
    toServer?: boolean;
  };
}

class Actions {
  deviceAdded: Action<{device: Device}> = {meta: {toClient: true}};
  deviceUpdated: Action<{device: Device}> = {meta: {toClient: true}};
  deviceRemoved: Action<{device: Device}> = {meta: {toClient: true}};

  pluginAdded: Action<{plugin: PluginConfiguration}> = {meta: {toClient: true}};
  pluginUpdated: Action<{plugin: PluginConfiguration}> = {meta: {toClient: true}};
  pluginRemoved: Action<{plugin: PluginConfiguration}> = {meta: {toClient: true}};

  syncState: Action<any> = {meta: {}};
}

export const actions = createActions(Actions);
