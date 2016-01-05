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

  checkStatus() {
    let self = this;
    function resolver(resolve, reject) {
      self.db.collectionNames(function (err) {
        if (err) {
          reject(self.serviceStatus.fails(err));
        } else {
          resolve(self.serviceStatus.success());
        }
      });
    }
    return new Promise(resolver);
  }
}

exports.MongoDbHealthChecker = MongoDbHealthChecker;
