import {clone} from 'redux-decorated';

export function deleteByProperty(property) {
  return (state, payload) => {
    const updatedState = clone(state);

    for (const id of Object.keys(state)) {
      if (state[id][property] === payload[property].id) {
        delete updatedState[id];
      }
    }

    return updatedState;
  }
}
