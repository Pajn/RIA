/* tslint:disable:no-empty */
import {devices} from './remote-procedures/devices';
import {Call, Device, PluginDefinition} from './entities';

export class Plugin {
  definition: PluginDefinition;

  /**
   * Calls a device.
   */
  callDevice(call: Call) {
    devices.callDevice(call);
  }

  /**
   * Called when a device is being created from one of the plugins DeviceClasses
   * Throw to abort the creation, return an updated device to alter its
   * configuration or return undefined to don't do anything at all.
   * If a Promise is returned then RAXA will wait for it to be resolved.
   */
  onDeviceCreated(device: Device): void|Device|Promise<void|Device> {
    return;
  }

  /**
   * Called when a device owned by the plugin is beeing called.
   * Throw to notify n error, return an updated device to alter its
   * configuration or return undefined to don't do anything at all.
   * If a Promise is returned then RAXA will wait for it to be resolved.
   */
  onDeviceCalled(call: Call, device: Device): Promise<any>|any {}

  /**
   * Called when the plugin is stopped, either becuse of beeing deactivated or RAXA stopping.
   * If a Promise is returned then RAXA will wait for it to be resolved.
   */
  stop(): void|Promise<void> {
    return;
  }
}
