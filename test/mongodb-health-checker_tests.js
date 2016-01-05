"use strict";

describe("MongoDbHealthChecker", function () {
  let MongoDbHealthChecker =  require("../src/mongodb-health-checker").MongoDbHealthChecker,
    expect = require("chai").expect,
    db = {collectionNames: function (cb) { return cb();}};

  it("should return 200 if everything is fine", function (done) {
    let checker = new MongoDbHealthChecker(db);
    checker.checkStatus().then(function (result) {
      expect(result.name).to.be.eql("MongoDb");
      expect(result.status).to.be.eql(200);
      done();
    });
  });

  it("should return 500 if can't connect", function (done) {
    let db =
      {collectionNames: function (cb) {
          cb(new Error());
        }
    };
    let checker = new MongoDbHealthChecker(db);
    checker.checkStatus().catch(function (result) {
      expect(result.name).to.be.eql("MongoDb");
      expect(result.status).to.be.eql(500);
      done();
    });
  });
});
