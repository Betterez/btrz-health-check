"use strict";

const childProcess = require("node:child_process");
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
      childProcess.execFile("git", ["rev-parse", "HEAD"], function (err, stdout) {
        if (err) {
          resolve(null);
          return;
        }

        resolve(stdout ? stdout.trim() : null);
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
