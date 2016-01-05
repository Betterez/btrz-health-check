"use strict";

describe("SQSHealthChecker", function () {
  let SQSHealthChecker =  require("../resources/health-checkers/sqs-health-checker").SQSHealthChecker,
    Queue = require("btrz-sqs").Queue,
    config = require("../config")(process.env),
    queue = new Queue(config.aws, "reports"),
    expect = require("chai").expect;

  it("should return 200 if everything is fine", function (done) {
    let checker = new SQSHealthChecker(queue);
    checker.checkStatus().then(function (result) {
      expect(result.name).to.be.eql("SQS");
      expect(result.status).to.be.eql(200);
      done();
    });
  });

  it("should return 500 if can't connect", function (done) {
    let queue = {sqs:
      {listQueues: function (cb) {
          cb(new Error());
        }
      }
    };
    let checker = new SQSHealthChecker(queue);
    checker.checkStatus().catch(function (result) {
      expect(result.name).to.be.eql("SQS");
      expect(result.status).to.be.eql(500);
      done();
    });
  });
});