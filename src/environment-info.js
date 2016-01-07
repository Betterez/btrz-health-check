"use strict";

let git = require("git-rev"),
 ec2 = require("ec2-metadata");

class EnvironmentInfo {

  git() {
    function resolver(resolve) {
      git.long(function (str) {
          resolve(str);
      });
    }
    return new Promise(resolver);
  }
  ec2instanceId() {
    function resolver(resolve, reject) {
      ec2("instance-id", function (err, instanceId) {
        if (err) {
          resolve("localhost");
        } else {
          resolve(instanceId);
        }
      });
    }
    return new Promise(resolver);
  }

  values() {
    return Promise.all([this.git(), this.ec2instanceId()])
      .then(function (results) {
        return {
          commit: results[0],
          instanceId: results[1]
        };
      });
  }
}

exports.EnvironmentInfo = EnvironmentInfo;
