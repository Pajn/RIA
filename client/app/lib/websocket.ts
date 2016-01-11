import {WebSocketClient} from 'websocket-redux/lib/client';
import {useWebSocketClient} from 'websocket-redux/lib/rpc/client';
import {actions} from 'raxa-common/lib/actions';
import {version} from 'raxa-common/lib/remote-procedures/version';
import {store, dispatch} from './store';

export const websocketClient = new WebSocketClient({url: 'ws://localhost:8080/'});
useWebSocketClient(websocketClient);
