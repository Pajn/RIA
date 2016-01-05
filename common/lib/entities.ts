/**
 * Every Device is created from a DeviceClass that describes
 * what the device implements and requires.
 *
 * DeviceClasses is provided by plugins while Devices is
 * created primarily by the user.
 */
export interface DeviceClass {
  id: string;
  /**
   * Name of this DeviceClass, it must be unique inside the plugin.
   */
  name: string;
  /**
   * Configuration values for the plugin that is set by the user while creating the Device.
   */
  config?: {[id: string]: Config<any>};
  /**
   * A list with names of the Interfaces that the Device created from this class implements.
   */
  interfaces: string[];
  /**
   * Static variables of the device as required by the implemented interfaces.
   * Every implemented interface with variables have its own object with its variables.
   */
  variables?: {[interfaceId: string]: {[variableName: string]: any}};
}

export interface Device {
  id?: number;
  /**
   * Name of this Device, it must be unique.
   */
  name: string;
  /**
   * Name of the plugin that owns this Device.
   */
  plugin: string;
  /**
   * Name of the DeviceClass the Device implements.
   */
  deviceClass: string;
  /**
   * Configuration values for the plugin.
   */
  config?: {[id: string]: Config<any>};
  /**
   * A list with names of the Interfaces that the Device created from this class implements.
   */
  interfaces: string[];
  /**
   * Status of the device as required by the implemented interfaces.
   * Every implemented interface with status have its own object with its statues.
   */
  status?: {[interfaceId: string]: {[statusName: string]: any}};
  /**
   * Variables of the device as required by the implemented interfaces.
   * Every implemented interface with variables have its own object with its variables.
   */
  variables?: {[interfaceId: string]: {[variableName: string]: any}};
}

export interface Interface {
  id: string;
  name: string;
  /**
   * Name of the plugin that specifies this Interface.
   * undefined if specified by RAXA.
   */
  plugin?: string;

  methods: {[method: string]: any};
  status: {[status: string]: any};
  variables: {[variable: string]: any};
}

export interface Call {
  /**
   * Id of the Device to be called.
   */
  deviceId: number;
  /**
   * Name of the interface the method is defined in.
   */
  interface: string;
  /**
   * Method to be called.
   */
  method: string;
  /**
   * Arguments to the method.
   */
  arguments: any;
}

export interface Config<T> {
  /**
   * Display name of the field.
   */
  name?: string;
  /**
   * Additional description of the field.
   */
  description?: string;
  /**
   * Type of the field
   */
  type: string;
  value?: T;
}

export interface PluginDefinition {
  id: string;
  name: string;
  deviceClasses: {[id: string]: DeviceClass};
}

export interface PluginConfiguration extends PluginDefinition {
  enabled: boolean;
}

/**
 * Interface
 * 433MHz Pulse
 *
 * Device Class Connectors (implements 433MHz Pulse)
 * RaxaTellstick
 * Sleipner433
 *
 * Device Class Lamps (requires 433MHz Pulse)
 * Nexa Selflearning
 * Nexa Switch Case
 *
 *
 */
