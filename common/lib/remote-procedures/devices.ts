import {remoteProcedures} from 'redux-websocket/lib/rpc';
import {Call, Device, Modification} from '../entities.ts';

@remoteProcedures()
export class Devices {
  async createDevice(device: Device) {}
  async callDevice(call: Call) {}
  async deleteDevice(deviceId: number) {}
  async modifyDeviceStatus(modification: Modification) {}
}

export const devices = new Devices();
