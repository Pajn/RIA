import {join, resolve} from 'path';
import {PluginConfiguration, Service} from 'raxa-common/lib/entities';
import {devices} from '../remote-procedures/devices';
import {Plugin} from 'raxa-common/lib/plugin-base';
import {dispatch, store} from './store';

export const plugins: {[id: string]: Plugin} = {};

function readJsonFile(path: string): any {
  return {main: 'dist/plugin.js', deviceClasses: {'MySensors Sensor': {}}};
}

export const pluginService: Service = {
  async start() {
    return Promise.all((Object.values(store.getState().plugins) as PluginConfiguration[])
      .filter(plugin => plugin.enabled)
      .map(async ({id}) => {
        const pluginDefinitionPath = join('plugins', id, 'plugin.json');
        const packageJsonPath = join('plugins', id, 'package.json');
        const packageJson = await readJsonFile(packageJsonPath);
        const pluginPath = join('plugins', id, packageJson.main || 'plugin.js');
        const plugin = require(resolve(pluginPath));

        if (plugin) {
          const PluginClass = plugin.default || plugin;
          const instance = new PluginClass() as Plugin;
          instance.definition = await readJsonFile(pluginDefinitionPath);
          instance.callDevice = devices.callDevice;
          instance.createDevice = devices.createDevice;
          instance.dispatch = dispatch;
          instance.getState = store.getState;
          await instance.start();
          plugins[id] = instance;
        }
      }));
  },

  async stop() {
    return Promise.all(Object.values(plugins).map(plugin => plugin.stop()));
  },
};
