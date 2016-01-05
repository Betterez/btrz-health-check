"use strict";

describe("ServiceStatus", function () {
  let ServiceStatus = require("../src/service-status").ServiceStatus,
    expect = require("chai").expect,
    defaultName = "Default";

  it("should take the defaultName if not options", function () {

    let service = new ServiceStatus(defaultName);
    expect(service.name).to.eql(defaultName);
  });

  it("should have a default logger", function () {
    let service = new ServiceStatus(defaultName);
    expect(service.logger.error).to.not.be.undefined;
  });

  it("should override the name from the options", function () {
    let options = {name: "MyService"},
    service = new ServiceStatus(defaultName, options);
    expect(service.name).to.be.eql(options.name);
  });

  it("should override the logger from the options", function () {
    let options = {logger: function () { return "hello"; }},
    service = new ServiceStatus(defaultName, options);
    expect(service.logger).to.be.eql(options.logger);
  });

  it("should return the status when it works", function () {
    let service = new ServiceStatus(defaultName),
      status = service.success();
    expect(status.name).to.be.eql(defaultName);
    expect(status.status).to.be.eql(200);
  });

  it("should return the status when it fails", function () {
    let service = new ServiceStatus(defaultName),
      status = service.fails();
    expect(status.name).to.be.eql(defaultName);
    expect(status.status).to.be.eql(500);
  });

  it("should call the logger with the error", function (done) {
    let options = {
      logger: {
        error: function (name, error) {
          expect(name).to.be.eql(defaultName);
          expect(error).not.to.be.null;
          done();
        }
      }
    };
    let service = new ServiceStatus(defaultName, options),
      status = service.fails(new Error());
  });
});
