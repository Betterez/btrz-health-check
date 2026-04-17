const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

describe("HealthCheckers", function () {
  const HealthCheckers = require("../src/health-checkers").HealthCheckers;

  it("should include the ec2 instance Id and the git revision", async function () {
    const checker = new HealthCheckers();
    const result = await checker.checkStatus([]);
    assert.notEqual(result.instanceId, undefined);
    assert.notEqual(result.commit, undefined);
    assert.equal(result.build, "123456789");
  });

  it("should return 200 if all services are ok", async function () {
    const checker = new HealthCheckers();
    const checks = [
      { checkStatus: function () { return Promise.resolve({ name: "MongoDb", status: 200 }); } },
      { checkStatus: function () { return Promise.resolve({ name: "SQS", status: 200 }); } },
      { checkStatus: function () { return Promise.resolve({ name: "Inventory", status: 200 }); } }
    ];
    const result = await checker.checkStatus(checks);
    assert.equal(result.status, 200);
    assert.equal(result.services.length, 3);
  });

  it("should return 500 and the failing services", async function () {
    const checker = new HealthCheckers();
    const checks = [
      { checkStatus: function () { return Promise.resolve({ name: "MongoDb", status: 200 }); } },
      { checkStatus: function () { return Promise.reject({ name: "SQS", status: 500 }); } },
      { checkStatus: function () { return Promise.resolve({ name: "Inventory", status: 200 }); } }
    ];
    const result = await checker.checkStatus(checks);
    assert.equal(result.status, 500);
    assert.equal(result.services[0].name, "SQS");
    assert.equal(result.services.length, 1);
  });
});
