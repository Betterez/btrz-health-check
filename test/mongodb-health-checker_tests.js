"use strict";

describe("MongoDbHealthChecker", function () {
  let MongoDbHealthChecker =  require("../src/mongodb-health-checker").MongoDbHealthChecker,
    expect = require("chai").expect,
    db = {collectionNames: function (cb) { return cb();}};

  it("should fail if not a proper mongoDriver instance", function () {
    function sut() {
      new MongoDbHealthChecker();
    }
    expect(sut).to.throw();
  });

  it("should fail if mongoDriver instance doesn't implement collectionNames", function () {
    function sut() {
      new MongoDbHealthChecker({});
    }
    expect(sut).to.throw();
  });

  it("should return 200 if everything is fine", function (done) {
    let checker = new MongoDbHealthChecker(db);
    checker.checkStatus().then(function (result) {
      expect(result.name).to.be.eql("MongoDb");
      expect(result.status).to.be.eql(200);
      done();
    });
  });

  it("should allow for a custom service name", function (done) {
    let checker = new MongoDbHealthChecker(db, {serviceName: "MyService"});
    checker.checkStatus().then(function (result) {
      expect(result.name).to.be.eql("MyService");
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

  it("should call the logger with the error if provide it", function (done) {
    let db =
      {collectionNames: function (cb) {
          cb(new Error());
        }
    },
    options = {
      logger: {
        error: function (name, err) {
          expect(name).to.eql("MongoDb");
          expect(err).not.to.be.null;
          done();
        }
      }
    };
    let checker = new MongoDbHealthChecker(db, options);
    checker.checkStatus();
  });

  it("should allow for a custom service name on failures as well", function (done) {
    let db =
      {collectionNames: function (cb) {
          cb(new Error());
        }
    };
    let checker = new MongoDbHealthChecker(db, {serviceName: "MyService"});
    checker.checkStatus().catch(function (result) {
      expect(result.name).to.be.eql("MyService");
      expect(result.status).to.be.eql(500);
      done();
    });
  });
});
