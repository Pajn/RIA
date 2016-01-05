import {WebSocketServer} from 'websocket-redux/lib/server';
import {useWebSocketServer} from 'websocket-redux/lib/rpc/server';

export let webSocketServer;

export function createWebSocketServer(server) {
  webSocketServer = new WebSocketServer(server);
  useWebSocketServer(webSocketServer);
}
