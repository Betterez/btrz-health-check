"use strict";

let ServiceStatus = require("./service-status").ServiceStatus;

class SQSHealthChecker {
  constructor(queue, options) {
    if (!queue || !queue.listQueues) {
      throw new Error("Requires a valid awsSqsDriver instance that implements 'listQueues'");
    }
    this.queue = queue;
    this.serviceStatus = new ServiceStatus("SQS", options);
  }

  checkStatus() {
    let self = this;
    function resolver(resolve, reject) {
      self.queue.listQueues(function (err, result) {
        if (err) {
          reject(self.serviceStatus.fails(err));
        }
        if (result) {
          resolve(self.serviceStatus.success());
        }
      });
    }
    return new Promise(resolver);
  }
}

exports.SQSHealthChecker = SQSHealthChecker;
