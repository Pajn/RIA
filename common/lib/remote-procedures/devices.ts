import {remoteProcedures} from 'redux-websocket/lib/rpc';
import {Call, Device} from '../entities.ts';

@remoteProcedures()
export class Devices {
  async createDevice(device: Device) {}
  async callDevice(call: Call) {}
}

export const devices = new Devices();
