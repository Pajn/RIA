import * as React from 'react'
import debounce from 'lodash.debounce'
import {interfaceId} from 'raxa-common/lib/default-interfaces'
import {Device} from 'raxa-common/lib/entities'
import {devices} from 'raxa-common/lib/remote-procedures/devices'
import {getStatus} from '../../lib/helpers'
import {stateful} from '../../lib/store'

export class Dimmer extends React.Component<{device: Device}, {}> {

  render() {
    const {id} = this.props.device
    const value = getStatus(id, interfaceId.Dimmer, 'level')

    return <div>
      <button onClick={() => this.setStatus(0)}>Off</button>
      <input type="range" min="0" max="100" value={value}
             onChange={(event: any) => this.setStatus(event.target.value)} />
    </div>
  }

  private setStatus(value) {
    const setStatus = debounce(() => {
      const {id} = this.props.device

      devices.modifyDeviceStatus({
        deviceId: id,
        interfaceId: interfaceId.Dimmer,
        status: 'level',
        value,
      })
    }, 150, {maxWait: 1000})

    setStatus()
  }
}
