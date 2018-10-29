"use strict";

describe("SequelizeDbHealthChecker", () => {
  const SequelizeDbHealthChecker =  require("../src/sequelize-health-checker").SequelizeDbHealthChecker,
    expect = require("chai").expect;

  it("should fail if a sequelize instance is not passed", () => {
    function sut() {
      new SequelizeDbHealthChecker();
    }
    expect(sut).to.throw("Requires a valid sequelize object");
  });

  it("should fail if the sequelize instance does not implement authenticate", () => {
    function sut() {
      new SequelizeDbHealthChecker({});
    }
    expect(sut).to.throw("Requires a sequelize object that implements the authenticate function");
  });

  it("should fail if the sequelize instance does not have a config", () => {
    function sut() {
      new SequelizeDbHealthChecker({authenticate: () => {}});
    }
    expect(sut).to.throw("Requires a sequelize object with a valid config");
  });  

  it("should return 200 if everything is fine", (done) => {
    const sequelize = {
        authenticate: () => {
          return Promise.resolve();
        },
        config: {}
      },
      checker = new SequelizeDbHealthChecker(sequelize);

    checker.checkStatus()
      .then((result) => {
        expect(result.name).to.be.eql("Sequelize DB");
        expect(result.status).to.be.eql(200);
        done();
      });
  });

  it("should allow a custom service name", (done) => {
    const sequelize = {
        authenticate: () => {
          return Promise.resolve();
        },
        config: {}
      },    
      checker = new SequelizeDbHealthChecker(sequelize, {name: "MyService"});

    checker.checkStatus()
      .then((result) => {
        expect(result.name).to.be.eql("MyService");
        expect(result.status).to.be.eql(200);
        done();
      });
  });

  it("should return 500 if authenticate fails", (done) => {
    const sequelize = {
        authenticate: () => {
          return Promise.reject();
        },
        config: {}
      },    
      checker = new SequelizeDbHealthChecker(sequelize, {name: "MyService"});

    checker.checkStatus()
      .then((result) => {
        expect(result.name).to.be.eql("MyService");
        expect(result.status).to.be.eql(500);
        done();
      });
  });
});
