import {readFile} from 'fs-promise'
import {join, resolve} from 'path'
import * as R from 'ramda'
import {PluginConfiguration, Service} from 'raxa-common/lib/entities'
import {Plugin} from 'raxa-common/lib/plugin-base'
import {dispatch, store} from './store'

export const plugins: {[id: string]: Plugin} = {}

async function readJsonFile(path: string) {
  const file = await readFile(path, {encoding: 'utf8'})

  return JSON.parse(file)
}

export const pluginService: Service = {
  async start() {
    // Need to load this after the websocket service has started
    const {devices} = require('../remote-procedures/devices')

    return Promise.all((Object.values(store.getState().plugins))
      .filter(R.prop('enabled'))
      .map(async ({id}) => {
        const pluginDefinitionPath = join('plugins', id, 'plugin.json')
        const packageJsonPath = join('plugins', id, 'package.json')
        const packageJson = await readJsonFile(packageJsonPath)
        const pluginPath = join('plugins', id, packageJson.main || 'plugin.js')
        const plugin = require(resolve(pluginPath))

        if (plugin) {
          const PluginClass = plugin.default || plugin
          const instance = new PluginClass() as Plugin
          Object.assign(instance, {
            definition: await readJsonFile(pluginDefinitionPath),
            callDevice: devices.callDevice,
            createDevice: devices.createDevice,
            dispatch,
            getState: store.getState,
          })
          await instance.start()
          plugins[id] = instance
        }
      }))
  },

  async stop() {
    return Promise.all(Object.values(plugins).map(plugin => plugin.stop()))
  },
}
