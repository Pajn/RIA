import {WebSocketClient} from 'websocket-redux/lib/client';
import {useWebSocketClient} from 'websocket-redux/lib/rpc/client';

export const websocketClient = new WebSocketClient('ws://localhost:8080/');
useWebSocketClient(websocketClient);
