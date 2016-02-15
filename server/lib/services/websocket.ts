import * as http from 'http'
import express from 'express'
import {RemoteProceduresDecorator} from 'redux-websocket/lib/rpc'
import {createRpcServer} from 'redux-websocket/lib/rpc/server'
import {WebSocketServer} from 'redux-websocket/lib/server'
import {Service} from 'raxa-common/lib/entities'
import {setRemoteProcedures} from 'raxa-common/lib/remote-procedures/index'

export let webSocketServer
export let remoteProcedures: RemoteProceduresDecorator

export const webSocketService: Service = {
 start() {
    const app = express()
    const server = http.createServer(app)

    app.get('/', function(req, res) {
       res.render('index', { layout: false })
    })
    server.listen(8080)

    webSocketServer = new WebSocketServer(server)
    remoteProcedures = createRpcServer({socket: webSocketServer}).remoteProcedures

    setRemoteProcedures((_) => (_) => {})
 },

 stop() {

 },
}
