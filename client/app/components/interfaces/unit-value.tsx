import * as React from 'react'
import {Component} from 'react'
import {span} from 'react-hyperscript-helpers'
import {interfaceId} from 'raxa-common/lib/default-interfaces'
import {Device, Interface} from 'raxa-common/lib/entities'
import {devices} from 'raxa-common/lib/remote-procedures/devices'
import {getStatus} from '../../lib/helpers'
import {store} from '../../lib/store'

type Properties = {
  device: Device,
  iface: Interface,
  status: string,
}

export class UnitValue extends Component<Properties, {status}> {

  render() {
    const {device, iface, status} = this.props

    return span([
      getStatus(device.id, iface.id, status),
      iface.status[status].unit,
    ])
  }

  static renderableStatuses(device: Device) {
    const {interfaces} = store.getState()

    return device.interfaces
        .map(interfaceId => interfaces[interfaceId])
        .filter(iface => !!iface)
        .map(iface => Object.entries(iface.status)
            .filter(([_, {modifiable, unit}]) => !modifiable && unit)
            .map(([status]) => ({iface, status, key: `${iface}.${status}`})))
        .reduce((outer, inner) => [...outer, ...inner], [])
  }
}
