import {Device, PluginConfiguration} from './entities';

export type DeviceState = {[id: number]: Device};
export type PluginState = {[id: string]: PluginConfiguration};

export type State = {
  devices: DeviceState,
  plugins: PluginState,
};