import 'babel-polyfill';
import requireDir from 'require-dir';
import {Service} from 'raxa-common/lib/entities';
import {pluginService} from './services/plugin';
import {storeService} from './services/store';
import {webSocketService} from './services/websocket';

/// Starts all passed services in order and stops them in the reverse order when the server stops
async function startServices(...services: Service[]) {
  console.log('startServices');
  for (const service of services) {
    await service.start();
  }
  console.log('startedServices');

  process.on('SIGINT', async () => {
    for (const service of services.reverse()) {
      await service.stop();
    }
    process.exit(0);
  });
}

async function start() {
  try {
    await startServices(
      webSocketService,
      storeService,
      pluginService
    );
    console.log('startedServices2');

    requireDir('./remote-procedures/');

    process.stdin.resume();
  } catch(e) {
    setImmediate(() => {throw e});
  }
}

start();
