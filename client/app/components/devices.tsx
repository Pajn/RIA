import * as React from 'react'
import {ul} from 'react-hyperscript-helpers'
import {Device} from 'raxa-common/lib/entities'
import {devices as deviceRpc} from 'raxa-common/lib/remote-procedures/devices'
import {stateful} from '../lib/store'
import {Interfaces} from './interfaces'

@stateful(state => ({
  devices: Object.entries(state.devices)
      .filter(([key]) => !isNaN(+key)) // Only allow numeric values
      .map(([key, value]) => value),
  status: state.status,
}))
export class Devices extends React.Component<{}, {devices: Device[], status}> {

  render() {
    const {devices, status} = this.state

    return ul(devices.map(device =>
      <li key={device.id}>
        <h2>{device.name}</h2>
        <p>{JSON.stringify(device)}</p>
        <p>{JSON.stringify(status[device.id])}</p>
        <Interfaces device={device} />
        <button onClick={() => deviceRpc.deleteDevice(device.id)}>Delete</button>
      </li>
    ))
  }
}
