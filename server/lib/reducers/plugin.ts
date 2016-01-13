import {createReducer, removeIn, updateIn} from 'redux-decorated';
import {actions} from 'raxa-common/lib/actions';
import {PluginState} from 'raxa-common/lib/state';

export const plugins = createReducer<PluginState>({})
  .when(actions.pluginAdded, (state, {plugin}) => updateIn(plugin.id, plugin, state))
  .when(actions.pluginUpdated, (state, {plugin}) => updateIn(plugin.id, plugin, state))
  .when(actions.pluginRemoved, (state, {plugin}) => removeIn(plugin.id, state))
  .build();
