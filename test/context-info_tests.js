"use strict";

describe("EnvironmentInfo", function () {
  let EnvironmentInfo = require("../src/environment-info").EnvironmentInfo,
    expect = require("chai").expect,
    env = new EnvironmentInfo();

  it("should include the git commit hash if is a git repo", function (done) {
    env.git()
      .then(function (result) {
        expect(result).not.to.be.null;
        done();
      });
  });

  it("should return localhost if can't find the ec2 instance Id", function (done) {
    env.ec2instanceId()
      .then(function (result) {
        expect(result).to.be.eql("localhost");
        done();
      });
  });

  it("should return the env variables combined", function (done) {
    env.values().then(function (result) {
      expect(result.commit).not.to.be.null;
      expect(result.instanceId).to.be.eql("localhost");
      done();
    });
  });
});
