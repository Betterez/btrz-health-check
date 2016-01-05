"use strict";

describe("MongoDbHealthChecker", function () {
  let MongoDbHealthChecker =  require("../resources/health-checkers/mongodb-health-checker").MongoDbHealthChecker,
    config = require("../config")(process.env),
    SimpleDao = require("btrz-simple-dao").SimpleDao,
    expect = require("chai").expect,
    simpleDao = new SimpleDao(config);

  it("should return 200 if everything is fine", function (done) {
    let checker = new MongoDbHealthChecker(simpleDao);
    checker.checkStatus().then(function (result) {
      expect(result.name).to.be.eql("MongoDb");
      expect(result.status).to.be.eql(200);
      done();
    });
  });

  it("should return 500 if can't connect", function (done) {
    let simpleDao = {db:
      {collectionNames: function () {
          return Promise.reject(new Error());
        }
      }
    };
    let checker = new MongoDbHealthChecker(simpleDao);
    checker.checkStatus().catch(function (result) {
      expect(result.name).to.be.eql("MongoDb");
      expect(result.status).to.be.eql(500);
      done();
    });
  });
});
