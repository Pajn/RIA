import {WebSocketClient} from 'redux-websocket/lib/client'
import {createRpcClient} from 'redux-websocket/lib/rpc/client'
import {setRemoteProcedures} from 'raxa-common/lib/remote-procedures/index'

export const websocketClient = new WebSocketClient({url: 'ws://localhost:8080/'})

setRemoteProcedures(createRpcClient({socket: websocketClient}).remoteProcedures)

require('./index')
