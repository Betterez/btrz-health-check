"use strict";
let ServiceStatus = require("./service-status").ServiceStatus;

class MongoDbHealthChecker {
  constructor(db, options) {
    if (!db || !db.collectionNames) {
      throw new Error("Requires a valid mongoDbDriver instance that implements 'collectionNames'");
    }
    this.db = db;
    this.serviceStatus = new ServiceStatus("MongoDb", options);
  }

  async checkStatus() {
    try {
      await this.db.collectionNames();
      return this.serviceStatus.success();
    } catch (err) {
      throw this.serviceStatus.fails(err);
    }
  }
}

exports.MongoDbHealthChecker = MongoDbHealthChecker;
