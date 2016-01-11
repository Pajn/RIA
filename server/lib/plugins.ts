import {Plugin} from 'raxa-common/lib/plugin-base';

export const plugins: {[id: string]: Plugin} = {
  t: {definition: {deviceClasses: {t: {}}}, onDeviceCreated: () => {}}
};
