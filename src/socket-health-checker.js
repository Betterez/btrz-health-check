"use strict";

let ServiceStatus = require("./service-status").ServiceStatus,
  net = require("net");

class SocketHealthChecker {
  constructor(config, options) {
    if (!config || !config.host || !config.port) {
      throw new Error("A configuration with the ip and port is required");
    }
    this.config = config;
    this.timeOut = config.timeout || 5000;
    this.serviceStatus = new ServiceStatus("Socket", options);
  }
  checkStatus() {
    let self = this;
    function resolver(resolve, reject) {
      let client = net.connect(self.config, function (err) {
        if (err) {
          reject(self.serviceStatus.fails(err));
        } else {
          resolve(self.serviceStatus.success());
        }
      });
      client.on("error", function (err) {
        reject(self.serviceStatus.fails(err));
      });
    }
    return new Promise(resolver);
  }
}

exports.SocketHealthChecker = SocketHealthChecker;
