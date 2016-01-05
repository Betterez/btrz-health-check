"use strict";

function serviceStatus(status) {
  return {name: "MongoDb", status: status};
}

class MongoDbHealthChecker {
  constructor(simpleDao) {
    this.simpleDao = simpleDao;
  }

  checkStatus() {
    return this.simpleDao.db.
      collectionNames().then(function () {
        return serviceStatus(200);
      })
      .catch(function () {
        return Promise.reject(serviceStatus(500));
      });
  }
}

exports.MongoDbHealthChecker = MongoDbHealthChecker;
