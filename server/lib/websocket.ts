import {WebSocketServer} from 'redux-websocket/lib/server';
import {useWebSocketServer} from 'redux-websocket/lib/rpc/server';

export let webSocketServer;

export function createWebSocketServer(server) {
  webSocketServer = new WebSocketServer(server);
  useWebSocketServer(webSocketServer);
}
