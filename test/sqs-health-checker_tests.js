"use strict";

describe("SQSHealthChecker", function () {
  let SQSHealthChecker =  require("../src/sqs-health-checker").SQSHealthChecker,
    sqs = {listQueues: function (cb) {cb(null, []); }},
    expect = require("chai").expect;

  it("should return 200 if everything is fine", function (done) {
    let checker = new SQSHealthChecker(sqs);
    checker.checkStatus().then(function (result) {
      expect(result.name).to.be.eql("SQS");
      expect(result.status).to.be.eql(200);
      done();
    });
  });

  it("should return 500 if can't connect", function (done) {
    let sqs =
      {listQueues: function (cb) {
          cb(new Error());
        }
      };
    let checker = new SQSHealthChecker(sqs);
    checker.checkStatus().catch(function (result) {
      expect(result.name).to.be.eql("SQS");
      expect(result.status).to.be.eql(500);
      done();
    });
  });
});
