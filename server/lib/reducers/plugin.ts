import {createReducer, removeIn, updateIn} from 'redux-decorated'
import {actions} from 'raxa-common/lib/actions'
import {PluginState} from 'raxa-common/lib/state'

export const plugins = createReducer<PluginState>({
  'MySensors': {
    id: 'MySensors',
    name: 'MySensors',
    enabled: true,
  }
})
  .when(actions.pluginAdded, ({plugin}) => updateIn(plugin.id, plugin))
  .when(actions.pluginUpdated, ({plugin}) => updateIn(plugin.id, plugin))
  .when(actions.pluginRemoved, ({plugin}) => removeIn(plugin.id))
