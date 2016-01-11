'use strict';
import {clientError, remoteProcedures} from 'websocket-redux/lib/rpc/server';
import {actions} from 'raxa-common/lib/actions';
import {Call, Device} from 'raxa-common/lib/entities';
import {Devices} from 'raxa-common/lib/remote-procedures/devices';
import {plugins} from '../plugins';
import {store, dispatch} from '../store';

@remoteProcedures({name: 'Devices'})
class ServerDevices extends Devices {
  async createDevice(device: Device) {
    console.log('creating device');
    const plugin = plugins[device.plugin];
    if (!plugin) {
      throw clientError('Invalid Plugin');
    }
    if (!plugin.definition.deviceClasses[device.deviceClass]) {
      throw clientError('Invalid Device Class');
    }
    console.log('state', store.getState());
    device.id = store.getState().devices.nextId;
    device = await plugin.onDeviceCreated(device) || device;
    dispatch(actions.deviceAdded, {device});
  }
  async callDevice(call: Call) {}
}
