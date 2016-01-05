"use strict";

function* getPromises(serviceCheckers) {
  for (var i=0; i < serviceCheckers.length; i++) {
    yield serviceCheckers[i].checkStatus();
  }
}

class HealthCheckers {
  checkStatus(serviceCheckers) {
    let promises = getPromises(serviceCheckers);
    return Promise.all(promises)
      .then(function (services) {
        return {status: 200, services: services};
      })
      .catch(function (failingService) {
        return {status: failingService.status, services: [failingService]};
      });
  }
}

exports.HealthCheckers = HealthCheckers;
