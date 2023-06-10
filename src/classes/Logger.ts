export default class Logger {
  private _debug: boolean;
  constructor(debug: boolean) {
    this._debug = debug;
  }

  time<T>(description: string, callback: () => T): T {
    if (!this._debug) {
      return callback();
    }

    console.time(description);
    const returnValue = callback();
    console.timeEnd(description);

    return returnValue;
  }
}
