"use strict";

const MongoDbHealthChecker =  require("../src/mongodb-health-checker").MongoDbHealthChecker;
const expect = require("chai").expect;
const db = {async collectionNames() { return ["some_collection"];}};
const sinon = require("sinon");
const sandbox = sinon.createSandbox();


describe("MongoDbHealthChecker", function () {

  afterEach(() => {
    sandbox.restore();
  });

  it("should fail if not a proper mongoDriver instance", function () {
    function sut() {
      new MongoDbHealthChecker();
    }
    expect(sut).to.throw("Requires a valid mongoDbDriver instance that implements 'collectionNames'");
  });

  it("should fail if mongoDriver instance doesn't implement collectionNames", function () {
    function sut() {
      new MongoDbHealthChecker({});
    }
    expect(sut).to.throw("Requires a valid mongoDbDriver instance that implements 'collectionNames'");
  });

  it("should return 200 if everything is fine", async () => {
    const checker = new MongoDbHealthChecker(db);
    const result = await checker.checkStatus();
    expect(result.name).to.be.eql("MongoDb");
    expect(result.status).to.be.eql(200);
  });

  it("should allow for a custom service name", async () => {
    const checker = new MongoDbHealthChecker(db, {name: "MyService"});
    const result = await checker.checkStatus();
    expect(result.name).to.be.eql("MyService");
    expect(result.status).to.be.eql(200);
  });

  it("should return 500 if can't connect", async () => {
    const db = {
      async collectionNames() {
        throw new Error("Some error");
      }
    };

    const checker = new MongoDbHealthChecker(db);

    try {
      await checker.checkStatus();
      expect.fail("Expected .checkStatus() to reject");
    } catch (err) {
      expect(err.name).to.be.eql("MongoDb");
      expect(err.status).to.be.eql(500);
    }
  });

  it("should call the logger with the error if provide it", async () => {
    const db = {
      async collectionNames() {
        throw new Error("Some error");
      }
    };
    const options = {
      logger: {
        error: sandbox.stub()
      }
    };
    let checker = new MongoDbHealthChecker(db, options);

    try {
      await checker.checkStatus();
      expect.fail("Expected .checkStatus() to reject");
    } catch (__) {
      expect(options.logger.error.calledOnce).to.be.true;
      const [name, err] = options.logger.error.getCall(0).args;
      expect(name).to.eql("MongoDb");
      expect(err).not.to.be.null;
    }
  });

  it("should allow for a custom service name on failures as well", async () => {
    const db = {
      async collectionNames() {
        throw new Error("Some error");
      }
    };
    const checker = new MongoDbHealthChecker(db, {name: "MyService"});

    try {
      await checker.checkStatus();
      expect.fail("Expected .checkStatus() to reject");
    } catch (err) {
      expect(err.name).to.be.eql("MyService");
      expect(err.status).to.be.eql(500);
    }
  });
});
