/* tslint:disable:no-empty */
import {Action} from './actions'
import {Call, Device, Modification, PluginDefinition, Service} from './entities'
import {State} from './state'

export class Plugin implements Service {
  definition: PluginDefinition
  /**
   * Calls a device.
   */
  callDevice: (call: Call) => Promise<void>
  createDevice: (device: Device) => Promise<void>
  dispatch: <T>(action: Action<T>, payload?: T) => void
  getState: () => State

  /**
   * Called when a device is being created from one of the plugins DeviceClasses
   * Throw to abort the creation, return an updated device to alter its
   * configuration or return undefined to don't do anything at all.
   * If a Promise is returned then RAXA will wait for it to be resolved.
   */
  onDeviceCreated(device: Device): void|Device|Promise<void|Device> {
    return
  }

  /**
   * Called when a device owned by the plugin is beeing called.
   * Throw to notify n error, return an updated device to alter its
   * configuration or return undefined to don't do anything at all.
   * If a Promise is returned then RAXA will wait for it to be resolved.
   */
  onDeviceCalled(call: Call, device: Device): void|Device|Promise<void|Device> {
    return
  }

  onDeviceStatusModified(modification: Modification, device: Device):
      void|Promise<void> {
    return
  }

  /**
   * Called when the plugin is stared, either becuse of beeing activated or when RAXA
   * is starting. If a Promise is returned then RAXA will wait for it to be resolved.
   */
  start(): void|Promise<any> {
    return
  }

  /**
   * Called when the plugin is stopped, either becuse of beeing deactivated or when RAXA
   * is stopping. If a Promise is returned then RAXA will wait for it to be resolved.
   */
  stop(): void|Promise<any> {
    return
  }
}
