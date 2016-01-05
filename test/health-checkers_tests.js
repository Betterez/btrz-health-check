"use strict";

describe("HealthCheckers", function () {
  let HealthCheckers = require("../src/health-checkers").HealthCheckers,
    expect = require("chai").expect;


  it("should return 200 if all services are ok", function (done) {
    var checker = new HealthCheckers(),
      checks = [
      {checkStatus: function () {return Promise.resolve({name: "MongoDb", status: 200}); }},
      {checkStatus: function () {return Promise.resolve({name: "SQS", status: 200}); }},
      {checkStatus: function () {return Promise.resolve({name: "Inventory", status: 200}); }}
    ];
    checker.checkStatus(checks).then(function (result) {
      expect(result.status).to.be.eql(200);
      expect(result.services.length).to.be.eql(3);
      done();
    });
  });

  it("should return 500 and the failing services", function (done) {
    var checker = new HealthCheckers(),
      checks = [
      {checkStatus: function () {return Promise.resolve({name: "MongoDb", status: 200}); }},
      {checkStatus: function () {return Promise.reject({name: "SQS", status: 500}); }},
      {checkStatus: function () {return Promise.resolve({name: "Inventory", status: 200}); }}
    ];
    checker.checkStatus(checks).then(function (result) {
      expect(result.status).to.be.eql(500);
      expect(result.services[0].name).to.be.eql("SQS");
      expect(result.services.length).to.be.eql(1);
      done();
    });
  });
});
