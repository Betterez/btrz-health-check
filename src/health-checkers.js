"use strict";

let EnvironmentInfo = require("./environment-info").EnvironmentInfo;

function* getPromises(serviceCheckers) {
  for (var i=0; i < serviceCheckers.length; i++) {
    yield serviceCheckers[i].checkStatus();
  }
}

function services(serviceCheckers) {
  let promises = getPromises(serviceCheckers);
  return Promise.all(promises)
    .then(function (services) {
      return {status: 200, services: services};
    })
    .catch(function (failingService) {
      return {status: failingService.status, services: [failingService]};
    });
}

class HealthCheckers {
  constructor() {
    this.env = new EnvironmentInfo();
  }
  checkStatus(serviceCheckers) {
    let self = this;
    return Promise.all([services(serviceCheckers), self.env.values()])
      .then(function (results) {
        results[0].commit = results[1].commit;
        results[0].instanceId = results[1].instanceId;
        results[0].build = results[1].build;
        return results[0];
      });
  }
}

exports.HealthCheckers = HealthCheckers;
