class ValueError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValueError";
  }
}

module.exports = ValueError;
