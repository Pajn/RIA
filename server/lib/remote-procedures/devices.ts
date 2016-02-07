'use strict';
import * as R from 'ramda';
import {clientError, remoteProcedures} from 'redux-websocket/lib/rpc/server';
import {actions} from 'raxa-common/lib/actions';
import {Call, Device, Modification} from 'raxa-common/lib/entities';
import {Devices} from 'raxa-common/lib/remote-procedures/devices';
import {plugins} from '../services/plugin';
import {store, dispatch} from '../services/store';

@remoteProcedures({name: 'Devices'})
class ServerDevices extends Devices {
  async createDevice(device: Device) {
    console.log('creating device');

    const plugin = plugins[device.plugin];
    if (!plugin) throw clientError('Invalid Plugin');

    const deviceClass = plugin.definition.deviceClasses[device.deviceClass];
    if (!deviceClass)
        throw clientError('Invalid Device Class');

    device.id = store.getState().devices.nextId;
    if (!device.interfaces) {
      device.interfaces = deviceClass.interfaces;
    }
    const interfaces = store.getState().interfaces;
    for (const iface of device.interfaces.map(iface => interfaces[iface])) {
      if (iface.variables) {
        if (!device.variables) {
          device.variables = {};
        }
        if (!device.variables[iface.id]) {
          device.variables[iface.id] = {};
        }

        for (const [variable, {defaultValue}] of Object.entries(iface.variables)) {
          if (device.variables[iface.id][variable] === undefined) {
            device.variables[iface.id][variable] = defaultValue;
          }
        }
      }
    }

    device = await plugin.onDeviceCreated(device) as Device || device;
    dispatch(actions.deviceAdded, {device});
  }

  async callDevice(call: Call) {
    console.log('callDevice');
    const device = store.getState().devices[call.deviceId];
    if (!device) throw clientError('Invalid Device');
    const plugin = plugins[device.plugin];

    const updatedDevice = await plugin.onDeviceCalled(call, device);

    if (updatedDevice) {
      dispatch(actions.deviceUpdated, {device: updatedDevice});
    }
  }

  async deleteDevice(deviceId: number) {
    console.log('deleteDevice', deviceId);
    const device = store.getState().devices[deviceId];

    if (device) {
      dispatch(actions.deviceRemoved, {device});
    }
  }

  async modifyDeviceStatus(modification: Modification) {
    console.log('modifyDeviceStatus');
    const device = store.getState().devices[modification.deviceId];
    if (!device) throw clientError('Invalid Device');
    const plugin = plugins[device.plugin];

    await plugin.onDeviceStatusModified(modification, device);

    dispatch(actions.statusUpdated, modification);
  }
}

export const devices = new ServerDevices();
