export default class Logger {
  private debug: boolean;
  constructor(debug: boolean) {
    this.debug = debug;
  }

  time<T>(description: string, callback: () => T): T {
    if (!this.debug) {
      return callback();
    }

    console.time(description);
    const returnValue = callback();
    console.timeEnd(description);

    return returnValue;
  }
}
