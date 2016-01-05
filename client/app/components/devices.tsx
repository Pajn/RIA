import * as React from 'react';
import {Device} from 'raxa-common/lib/entities';
import {devices as deviceRpc} from 'raxa-common/lib/remote-procedures/devices';
import {stateful} from '../lib/store';

@stateful(state => ({devices: Object.values(state.devices)}))
export class Devices extends React.Component<{}, {devices: Device[]}> {

  render() {
    const {devices} = this.state;

    return (
      <div>
        <ul>
          {devices.map(device => <li>{device.name}</li>)}
        </ul>
        <button onClick={() => {
          deviceRpc.createDevice({id: 1, name: 'test', plugin: 't', deviceClass: 't', interfaces: []});
        }}>Create Device</button>
      </div>
    );
  }
}
