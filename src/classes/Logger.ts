export default class Logger {
  private debug: boolean;
  constructor(debug: boolean) {
    this.debug = debug;
  }

  time<T>(message: string, callback: () => T): T {
    if (!this.debug) {
      return callback();
    }

    console.time(message);
    const returnValue = callback();
    console.timeEnd(message);

    return returnValue;
  }
}
