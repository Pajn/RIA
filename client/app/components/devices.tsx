import * as React from 'react';
import {Device} from 'raxa-common/lib/entities';
import {devices as deviceRpc} from 'raxa-common/lib/remote-procedures/devices';
import {stateful} from '../lib/store';
import {Interfaces} from './interfaces';

@stateful(state => ({
  devices: Object.entries(state.devices)
      .filter(([key]) => !isNaN(+key)) // Only allow numeric values
      .map(([key, value]) => value)
}))
export class Devices extends React.Component<{}, {devices: Device[]}> {

  render() {
    const {devices} = this.state;

    return (
      <div>
        <ul>
          {devices.map((device) => (
            <li key={device.id}>
              <h2>{device.name}</h2>
              <p>{JSON.stringify(device)}</p>
              <button onClick={() => {
                deviceRpc.deleteDevice(device.id);
              }}>Delete</button>
              <Interfaces device={device} />
            </li>
          ))}
        </ul>
        <button onClick={() => {
          //deviceRpc.createDevice({name: 'test', plugin: 't', deviceClass: 't'});
        }}>Create Device</button>
      </div>
    );
  }
}
