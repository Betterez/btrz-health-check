"use strict";

function serviceStatus(serviceName, status) {
  return {name: serviceName, status: status};
}

class MongoDbHealthChecker {
  constructor(db, options) {
    if (!db || !db.collectionNames) {
      throw new Error("Instanciate with a valid mongoDbDriver instance");
    }
    this.db = db;
    this.serviceName = options && options.serviceName ? options.serviceName : "MongoDb";
    this.logger = options && options.logger ? options.logger : {error: function () {}};
  }

  checkStatus() {
    let self = this;
    function resolver(resolve, reject) {
      self.db.collectionNames(function (err) {
        if (err) {
          self.logger.error(self.serviceName, err);
          reject(serviceStatus(self.serviceName, 500));
        } else {
          resolve(serviceStatus(self.serviceName, 200));
        }
      });
    }
    return new Promise(resolver);
  }
}

exports.MongoDbHealthChecker = MongoDbHealthChecker;
