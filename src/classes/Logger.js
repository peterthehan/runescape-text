class Logger {
  constructor(showLogs) {
    this.showLogs = showLogs;
  }

  time(message, callback) {
    let returnValue;

    if (this.showLogs) {
      console.time(message);
      returnValue = callback();
      console.timeEnd(message);
    } else {
      returnValue = callback();
    }

    return returnValue;
  }
}

module.exports = Logger;
