import {RemoteProceduresDecorator} from 'redux-websocket/lib/rpc'

export let remoteProcedures: RemoteProceduresDecorator

export function setRemoteProcedures(rp: RemoteProceduresDecorator) {
  remoteProcedures = rp

  if (typeof window !== 'undefined') {
    window['remoteProcedures'] = rp
  }
}

if (typeof window !== 'undefined') {
  if (window['setRemoteProcedures']) {
    const other = setRemoteProcedures
    window['setRemoteProcedures'] = rp => {
      setRemoteProcedures(rp)
      other(rp)
    }
  } else {
    window['setRemoteProcedures'] = setRemoteProcedures
  }

  if (window['remoteProcedures']) {
    remoteProcedures = window['remoteProcedures']
  }
}
