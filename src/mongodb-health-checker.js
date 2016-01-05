"use strict";

function serviceStatus(status) {
  return {name: "MongoDb", status: status};
}

class MongoDbHealthChecker {
  constructor(db) {
    this.db = db;
  }

  checkStatus() {
    let self = this;
    function resolver(resolve, reject) {
      self.db.collectionNames(function (err) {
        if (err) {
          reject(serviceStatus(500));
        } else {
          resolve(serviceStatus(200));
        }
      });
    }
    return new Promise(resolver);
  }
}

exports.MongoDbHealthChecker = MongoDbHealthChecker;
