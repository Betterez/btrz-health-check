"use strict";

function serviceStatus(status) {
  return {name: "SQS", status: status};
}

class SQSHealthChecker {
  constructor(queue) {
    this.queue = queue;
  }

  checkStatus() {
    let self = this;
    function resolver(resolve, reject) {
      self.queue.sqs.listQueues(function (err, result) {
        if (err) {
          reject(serviceStatus(500));
        }
        if (result) {
          resolve(serviceStatus(200));
        }
      });
    }
    return new Promise(resolver);
  }
}

exports.SQSHealthChecker = SQSHealthChecker;
