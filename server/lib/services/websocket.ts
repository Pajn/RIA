import * as http from 'http';
import express from 'express';
import {WebSocketServer} from 'redux-websocket/lib/server';
import {useWebSocketServer} from 'redux-websocket/lib/rpc/server';
import {Service} from 'raxa-common/lib/entities';

export let webSocketServer;

export const webSocketService: Service = {
 start() {
    const app = express();
    const server = http.createServer(app);

    app.get('/', function(req, res) {
       res.render('index', { layout: false });
    });
    server.listen(8080);

    webSocketServer = new WebSocketServer(server);
    useWebSocketServer(webSocketServer);
 },

 stop() {

 },
};
