'use strict';

import * as R from 'ramda';
import {SerialPort, parsers} from 'serialport';
import {actions} from 'raxa-common/lib/actions';
import {Call, Config, Device, Modification} from 'raxa-common/lib/entities';
import {interfaceId} from 'raxa-common/lib/default-interfaces';
import {Plugin} from 'raxa-common/lib/plugin-base';
import {
    C_INTERNAL,
    C_PRESENTATION,
    C_REQ,
    C_SET,

    I_CONFIG,
    I_SKETCH_NAME,
    I_TIME,

    S_DIMMER,
    S_LIGHT,
    S_RGB_LIGHT,
    S_TEMP,

    V_PERCENTAGE,
    V_RGB,
    V_STATUS,
    V_TEMP,
} from './definitions';

const gwBaud = 115200;

const interfaces = Object.freeze({
  [S_LIGHT]: interfaceId.Light,
  [S_DIMMER]: interfaceId.Dimmer,
  [S_RGB_LIGHT]: interfaceId.RGB,
  [S_TEMP]: interfaceId.Temperature,
});

const statuses = Object.freeze({
  [V_STATUS]: {interfaceId: interfaceId.Light, status: 'on'},
  [V_PERCENTAGE]: {interfaceId: interfaceId.Dimmer, status: 'level'},
  [V_RGB]: {interfaceId: interfaceId.RGB, status: 'color'},
  [V_TEMP]: {interfaceId: interfaceId.Temperature, status: 'temp'},
});

const names = {};

const serialPorts = {} as {[id: number]: SerialPort};

export interface SerialGateway extends Device {
  config: {
    serialPort: string,
    [field: string]: any,
  };
}

export interface Sensor extends Device {
  config: {
    gateway: number,
    node: number,
    sensor: number,
    [field: string]: any,
  };
}

function isGateway(device: Device): device is SerialGateway {
  return device.deviceClass === 'Serial MySensors Gateway';
}

function hex(value: number) {
  let string = '';
  if (value < 16) {
    string += '0';
  }
  string += value.toString(16);
  return string;
}

function encode(destination, sensor, command, acknowledge, type, payload) {
  let message = destination.toString(10) + ';' +
                sensor.toString(10) + ';' +
                command.toString(10) + ';' +
                acknowledge.toString(10) + ';' +
                type.toString(10) + ';';

  if (command === 4) {
    for (var i = 0; i < payload.length; i++) {
      message += hex(payload[i]);
    }
  } else {
    message += payload;
  }
  message += '\n';
  return message;
}

//noinspection JSUnusedLocalSymbols
export default class MySensorsPlugin extends Plugin {
  onDeviceCreated(device: Sensor|SerialGateway) {
    if (isGateway(device)) {
      this.openGateway(device);
    }
  }

  onDeviceStatusModified(modification: Modification, device: Sensor) {
    const send = this.send.bind(
      this,
      device.config.gateway,
      device.config.node,
      0,
      C_SET
    );

    switch (modification.interfaceId) {

      case interfaceId.Light:
        return send(
            V_STATUS,
            modification.value ? 1 : 0
        );

      case interfaceId.Dimmer:
        return send(
            V_PERCENTAGE,
            ('00' + modification.value).slice(-3)
        );

      case interfaceId.RGB:
        return send(
            V_RGB,
            hex(modification.value.red) +
            hex(modification.value.green) +
            hex(modification.value.blue)
        );

      default:
        throw new Error(`Can modify status of ${modification.interfaceId}`);
    }
  }

  onDeviceCalled(call: Call, device: Sensor|SerialGateway) {
    if (isGateway(device)) {
      const {node, sensor, type, subType, payload} = call.arguments;
      const message = encode(node, sensor, type, 0, subType, payload);

      console.log('-> ' + message);
      serialPorts[device.id].write(message);
    }
  }

  start() {
    console.log('MySensors start');
    Object.values(this.getState().devices)
      .filter(({deviceClass, plugin}) =>
        deviceClass === 'Serial MySensors Gateway' && plugin === 'MySensors')
      .forEach(this.openGateway.bind(this));
  }

  stop() {
    return Promise.all(Object.values(serialPorts)
      .map(port => new Promise(resolve => port.close(resolve)))
    );
  }

  private openGateway({id, config}: SerialGateway) {
    const serialPort = config.serialPort;
    const port = new SerialPort(serialPort, {
      baudrate: gwBaud,
      parser: parsers.readline('\n'),
    });

    let errors = 0;

    port.on('open', () => {
      console.log('connected to serial gateway at ' + serialPort);
      serialPorts[id] = port;
      errors = 0;
    });

    port.on('end', () => {
      console.log('disconnected from gateway at ' + serialPort);
      serialPorts[id];
    });

    port.on('data', rd => {
      this.receivedMessage(id, rd);
    });

    port.on('error', () => {
      console.log('connection error - trying to reconnect to ' + serialPort);

      setTimeout(() => {
        port.open();
      }, (errors ** 2) * 1000);
      errors++;
    });
  }

  private send(deviceId, node, sensor, type, subType, payload) {
    return this.callDevice({
      deviceId,
      'interface': 'MySensors Gateway',
      method: 'send',
      arguments: {node, sensor, type, subType, payload},
    });
  }

  private receivedMessage(deviceId: number, message: string) {
    if (message == '') return;

    console.log('<- ' + message);

    // decoding message
    const [sender, sensor, command, ack, type, payload]:
          [number, number, number, boolean, number, string] =
        message.split(';').map((p, i) => i === 5 ? p : +p) as any;

    switch (command) {
      case C_PRESENTATION:
        this.sensorPresented(deviceId, sender, sensor, type);
        break;

      case C_SET:
        this.statusUpdate(deviceId, sender, sensor, type, payload);
        break;

      case C_REQ:
        this.statusRequest(deviceId, sender, sensor, type);
        break;

      case C_INTERNAL:
        const send = this.send.bind(
          this,
          deviceId,
          sender,
          sensor,
          C_INTERNAL
        );

        switch (type) {

          case I_TIME:
            send(I_TIME, Date.now()/1000);
            break;

          case I_CONFIG:
            send(I_CONFIG, 'M');
            break;

          case I_SKETCH_NAME:
            this.nameReceived(deviceId, sender, payload.trim());
            break;
        }

        break;
    }
  }

  private getSensor(gatewayId, nodeId, sensor) {
    return (Object.values(this.getState().devices)
        .filter(({deviceClass, plugin}) =>
            plugin === 'MySensors' &&
            deviceClass === 'MySensors Sensor') as Sensor[])
        .find(({config}) =>
            config.gateway === gatewayId &&
            config.node === nodeId &&
            config.sensor === sensor)
  }

  private sensorPresented(gatewayId, nodeId, sensor, type) {
    if (!interfaces[type]) return;

    const device = this.getSensor(gatewayId, nodeId, sensor);

    if (!device) {
      const createDevice = () => {
        const name = names[`${gatewayId}:${nodeId}`] ||
            `MySensors ${interfaces[type]} ${nodeId}:${sensor}`;

        this.createDevice({
          name,
          plugin: 'MySensors',
          deviceClass: 'MySensors Sensor',
          config: {
            gateway: gatewayId,
            node: nodeId,
            sensor,
          },
          interfaces: [interfaces[type]],
        } as Sensor).catch(e => setImmediate(() => {throw e}));
      };

      if (!names[`${gatewayId}:${nodeId}`]) {
        setTimeout(createDevice, 100);
      } else {
        createDevice();
      }
    }
  }

  private nameReceived(gatewayId, nodeId, name) {
    names[`${gatewayId}:${nodeId}`] = name;
    setTimeout(() => {
      delete names[`${gatewayId}:${nodeId}`];
    }, 10000);
  }

  private statusUpdate(gatewayId, nodeId, sensor, type, value) {
    const path = statuses[type];
    if (!path) return;
    const {interfaceId, status} = path;

    switch (type) {

      case V_STATUS:
        value = +value === 1;
        break;

      case V_TEMP:
      case V_PERCENTAGE:
        value = +value;
        break;

      case V_RGB:
        value = {
          red: parseInt(value.substring(0, 2), 16),
          green: parseInt(value.substring(2, 4), 16),
          blue: parseInt(value.substring(4, 6), 16),
        };
        break;

      default:
        return;
    }

    const device = this.getSensor(gatewayId, nodeId, sensor);

    if (device) {
      this.dispatch(
          actions.statusUpdated,
          {deviceId: device.id, interfaceId, status, value}
      );
    }
  }

  private statusRequest(gatewayId, nodeId, sensor, type) {
    const path = statuses[type];
    if (!path) return;
    const {interfaceId, status} = path;
    const device = this.getSensor(gatewayId, nodeId, sensor);

    if (device) {
      const value = this.getState().status[device.id][interfaceId][status];

      this.onDeviceStatusModified({
        deviceId: device.id,
        interfaceId,
        status,
        value,
      }, device as Sensor);
    }
  }
}
