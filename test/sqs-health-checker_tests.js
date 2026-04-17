const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

describe("SQSHealthChecker", function () {
  const SQSHealthChecker =  require("../src/sqs-health-checker").SQSHealthChecker;
  const sqs = {listQueues: function () { return Promise.resolve();}};

  it("shouldn throw if not a proper awsSqs is given", function () {
    function sut() {
      new SQSHealthChecker();
    }
    assert.throws(sut);
  });

  it("shouldn throw if awsSqs doesn't implement listQueues", function () {
    function sut() {
      new SQSHealthChecker({});
    }
    assert.throws(sut);
  });

  it("should return 200 if everything is fine", async function () {
    const checker = new SQSHealthChecker(sqs);
    const result = await checker.checkStatus();
    assert.equal(result.name, "SQS");
    assert.equal(result.status, 200);
  });

  it("should allow for a custom service name", async function () {
    const checker = new SQSHealthChecker(sqs, {name: "MyService"});
    const result = await checker.checkStatus();
    assert.equal(result.name, "MyService");
    assert.equal(result.status, 200);
  });

  it("should return 500 if can't connect", async function () {
    const failingSqs =
      {listQueues: function () {
          return Promise.reject();
        }
      };
    const checker = new SQSHealthChecker(failingSqs);
    await assert.rejects(checker.checkStatus(), (result) => {
      assert.equal(result.name, "SQS");
      assert.equal(result.status, 500);
      return true;
    });
  });

  it("should call the logger with the error if provide it", async function () {
    const failingSqs =
      {listQueues: function () {
          return Promise.reject();
        }
    },
      options = {
      logger: {
        error: function () {
        }
      }
    };
    const checker = new SQSHealthChecker(failingSqs, options);
    await assert.rejects(checker.checkStatus(), (result) => {
      assert.equal(result.name, "SQS");
      assert.equal(result.status, 500);
      return true;
    });
  });

  it("should allow for a custom service name on failures as well", async function () {
    const failingSqs =
      {listQueues: function () {
          return Promise.reject();
        }
      };
    const checker = new SQSHealthChecker(failingSqs, {name: "MyService"});
    await assert.rejects(checker.checkStatus(), (result) => {
      assert.equal(result.name, "MyService");
      assert.equal(result.status, 500);
      return true;
    });
  });
});
