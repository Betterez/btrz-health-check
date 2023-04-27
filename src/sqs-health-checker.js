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
    return self.queue.listQueues({})
      .then(() => {
        return self.serviceStatus.success();
      })
      .catch((err) => {
        return Promise.reject(self.serviceStatus.fails(err));
      });
  }
}

exports.SQSHealthChecker = SQSHealthChecker;
