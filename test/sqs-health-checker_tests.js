"use strict";

describe("SQSHealthChecker", function () {
  let SQSHealthChecker =  require("../src/sqs-health-checker").SQSHealthChecker,
    sqs = {listQueues: function (cb) {cb(null, []); }},
    expect = require("chai").expect;

  it("shouldn throw if not a proper awsSqs is given", function () {
    function sut() {
      new SQSHealthChecker();
    }
    expect(sut).to.throw();
  });

  it("shouldn throw if awsSqs doesn't implement listQueues", function () {
    function sut() {
      new SQSHealthChecker({});
    }
    expect(sut).to.throw();
  });

  it("should return 200 if everything is fine", function (done) {
    let checker = new SQSHealthChecker(sqs);
    checker.checkStatus().then(function (result) {
      expect(result.name).to.be.eql("SQS");
      expect(result.status).to.be.eql(200);
      done();
    });
  });

  it("should allow for a custom service name", function (done) {
    let checker = new SQSHealthChecker(sqs, {name: "MyService"});
    checker.checkStatus().then(function (result) {
      expect(result.name).to.be.eql("MyService");
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

  it("should call the logger with the error if provide it", function (done) {
    let sqs =
      {listQueues: function (cb) {
          cb(new Error());
        }
    },
    options = {
      logger: {
        error: function () {
        }
      }
    };
    let checker = new SQSHealthChecker(sqs, options);
    checker.checkStatus().catch((result) => {
      expect(result.name).to.be.eql("SQS");
      expect(result.status).to.be.eql(500);
      done();
    });
  });

  it("should allow for a custom service name on failures as well", function (done) {
    let sqs =
      {listQueues: function (cb) {
          cb(new Error());
        }
      };
    let checker = new SQSHealthChecker(sqs, {name: "MyService"});
    checker.checkStatus().catch(function (result) {
      expect(result.name).to.be.eql("MyService");
      expect(result.status).to.be.eql(500);
      done();
    });
  });
});
