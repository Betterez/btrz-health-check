const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

describe("ServiceStatus", function () {
  const ServiceStatus = require("../src/service-status").ServiceStatus;
  const defaultName = "Default";

  it("should take the defaultName if not options", function () {
    const service = new ServiceStatus(defaultName);
    assert.equal(service.name, defaultName);
  });

  it("should have a default logger", function () {
    const service = new ServiceStatus(defaultName);
    assert.notEqual(service.logger.error, undefined);
  });

  it("should override the name from the options", function () {
    const options = { name: "MyService" };
    const service = new ServiceStatus(defaultName, options);
    assert.equal(service.name, options.name);
  });

  it("should override the logger from the options", function () {
    const options = { logger: function () { return "hello"; } };
    const service = new ServiceStatus(defaultName, options);
    assert.equal(service.logger, options.logger);
  });

  it("should return the status when it works", function () {
    const service = new ServiceStatus(defaultName);
    const status = service.success();
    assert.equal(status.name, defaultName);
    assert.equal(status.status, 200);
  });

  it("should return the status when it fails", function () {
    const service = new ServiceStatus(defaultName);
    const status = service.fails();
    assert.equal(status.name, defaultName);
    assert.equal(status.status, 500);
  });

  it("should call the logger with the error", function () {
    const options = {
      logger: {
        error: function (name, error) {
          assert.equal(name, defaultName);
          assert.notEqual(error, null);
        }
      }
    };
    const service = new ServiceStatus(defaultName, options);
    service.fails(new Error("failure"));
  });
});
