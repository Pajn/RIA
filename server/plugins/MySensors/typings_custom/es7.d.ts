interface Object {
  entries<T>(object: {[key: number]: T}): Array<[string, T]>;
  entries<T>(object: {[key: string]: T}): Array<[string, T]>;
  values<T>(object: {[key: number]: T}): Array<T>;
  values<T>(object: {[key: string]: T}): Array<T>;
}

declare class Promise<T> {
  constructor(a: (resolve, reject) => any)

  then<U>(callback: (a: T) => U): Promise<U>;
  catch(callback: (a) => void): Promise<T>;
  static all(a: Promise<any>[]): Promise<Array<any>>;
}

declare interface Array<T> {
  find(b: (a: T) => boolean): T;
}
