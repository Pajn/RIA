import {WebSocketClient} from 'redux-websocket/lib/client';
import {useWebSocketClient} from 'redux-websocket/lib/rpc/client';

export const websocketClient = new WebSocketClient({url: 'ws://localhost:8080/'});
useWebSocketClient(websocketClient);
