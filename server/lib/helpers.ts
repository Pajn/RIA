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

/**
 * Creates an object from an array by applying the two mapping functions
 * for each object in the array
 */
export function zipMap(keyMap: (obj) => any, valueMap: (obj) => any) {
  return values => {
    const obj = {};
    console.log(values);
    for (const value of values) {
      obj[keyMap(value)] = valueMap(value);
    }
    return obj;
  };
}

/**
 * Debug utility to quickly be able to log the value in a pipe or
 * similar function chain
 */
export function logAndPassThrough(message?) {
  return obj => {
    if (message) {
      console.log(message, obj);
    } else {
      console.log(obj);
    }

    return obj;
  }
}
