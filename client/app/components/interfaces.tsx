import * as React from 'react'
import {div, h} from 'react-hyperscript-helpers'
import {interfaceId} from 'raxa-common/lib/default-interfaces'
import {Device} from 'raxa-common/lib/entities'
import {Dimmer} from './interfaces/dimmer'
import {UnitValue} from './interfaces/unit-value'

const components = {
  [interfaceId.Dimmer]: Dimmer
}

export class Interfaces extends React.Component<{device: Device}, {}> {

  render() {
    const {device} = this.props

    return div([
      ...device.interfaces
        .map(iface => ({iface, Component: components[iface]}))
        .filter(({Component}) => !!Component)
        .map(({iface, Component}) => h(Component, {device, key: iface})),

      ...UnitValue.renderableStatuses(device)
        .map(props => h(UnitValue, Object.assign({device}, props))),
    ])
  }
}
