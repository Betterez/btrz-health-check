"use strict";

const git = require("git-rev");
const ec2 = require("./ec2-metadata");

class EnvironmentInfo {

  buildNumber() {
    return process.env.BUILD_NUMBER || "0";
  }

  ec2instanceId() {
    function resolver(resolve) {
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

  git() {
    function resolver(resolve) {
      git.long(function (str) {
          resolve(str);
      });
    }
    return new Promise(resolver);
  }

  values() {
    let self = this;
    return Promise.all([this.git(), this.ec2instanceId()])
      .then(function (results) {
        return {
          commit: results[0],
          instanceId: results[1],
          build: self.buildNumber()
        };
      });
  }
}

exports.EnvironmentInfo = EnvironmentInfo;
