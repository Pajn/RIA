import * as React from 'react';
import {Device} from 'raxa-common/lib/entities';
import {devices as deviceRpc} from 'raxa-common/lib/remote-procedures/devices';
import {stateful} from '../lib/store';

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
          {devices.map(({id, name}) => <li key={id}>{name}</li>)}
        </ul>
        <button onClick={() => {
          deviceRpc.createDevice({name: 'test', plugin: 't', deviceClass: 't'});
        }}>Create Device</button>
      </div>
    );
  }
}
