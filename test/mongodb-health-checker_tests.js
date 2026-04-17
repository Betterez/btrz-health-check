const assert = require("node:assert/strict");
const { afterEach, describe, it } = require("node:test");
const MongoDbHealthChecker =  require("../src/mongodb-health-checker").MongoDbHealthChecker;
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
    assert.throws(sut, /Requires a valid mongoDbDriver instance that implements 'collectionNames'/);
  });

  it("should fail if mongoDriver instance doesn't implement collectionNames", function () {
    function sut() {
      new MongoDbHealthChecker({});
    }
    assert.throws(sut, /Requires a valid mongoDbDriver instance that implements 'collectionNames'/);
  });

  it("should return 200 if everything is fine", async () => {
    const checker = new MongoDbHealthChecker(db);
    const result = await checker.checkStatus();
    assert.equal(result.name, "MongoDb");
    assert.equal(result.status, 200);
  });

  it("should allow for a custom service name", async () => {
    const checker = new MongoDbHealthChecker(db, {name: "MyService"});
    const result = await checker.checkStatus();
    assert.equal(result.name, "MyService");
    assert.equal(result.status, 200);
  });

  it("should return 500 if can't connect", async () => {
    const db = {
      async collectionNames() {
        throw new Error("Some error");
      }
    };

    const checker = new MongoDbHealthChecker(db);

    await assert.rejects(checker.checkStatus(), (err) => {
      assert.equal(err.name, "MongoDb");
      assert.equal(err.status, 500);
      return true;
    });
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

    await assert.rejects(checker.checkStatus());
    assert.equal(options.logger.error.calledOnce, true);
    const [name, err] = options.logger.error.getCall(0).args;
    assert.equal(name, "MongoDb");
    assert.notEqual(err, null);
  });

  it("should allow for a custom service name on failures as well", async () => {
    const db = {
      async collectionNames() {
        throw new Error("Some error");
      }
    };
    const checker = new MongoDbHealthChecker(db, {name: "MyService"});

    await assert.rejects(checker.checkStatus(), (err) => {
      assert.equal(err.name, "MyService");
      assert.equal(err.status, 500);
      return true;
    });
  });
});
