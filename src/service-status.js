"use strict";
function serviceStatus(name, status) {
  return {name: name, status: status};
}

class ServiceStatus {
  constructor(defaultName, options) {
    this.name = options && options.name ? options.name : defaultName;
    this.logger = options && options.logger ? options.logger : {error: function () {}};
  }

  success() {
    return serviceStatus(this.name, 200);
  }

  fails(err) {
    this.logger.error(this.name, err);
    return serviceStatus(this.name, 500);
  }
}

exports.ServiceStatus = ServiceStatus;
