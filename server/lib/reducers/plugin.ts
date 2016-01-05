import {createReducer, removeIn, updateIn} from 'decorated-redux';
import {actions} from 'raxa-common/lib/actions';
import {PluginState} from 'raxa-common/lib/state';

export const plugins = createReducer<PluginState>({})
  .when(actions.pluginAdded, (state, {plugin}) => updateIn(plugin.id, plugin, state))
  .when(actions.pluginUpdated, (state, {plugin}) => updateIn(plugin.id, plugin, state))
  .when(actions.pluginRemoved, (state, {plugin}) => removeIn(plugin.id, state))
  .when(actions.syncState, (state, newState) => newState.plugins || state)
  .build();
