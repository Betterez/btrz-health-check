const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

describe("SequelizeDbHealthChecker", () => {
  const SequelizeDbHealthChecker =  require("../src/sequelize-health-checker").SequelizeDbHealthChecker;

  it("should fail if a sequelize instance is not passed", () => {
    function sut() {
      new SequelizeDbHealthChecker();
    }
    assert.throws(sut, /Requires a valid sequelize object/);
  });

  it("should fail if the sequelize instance does not implement authenticate", () => {
    function sut() {
      new SequelizeDbHealthChecker({});
    }
    assert.throws(sut, /Requires a sequelize object that implements the authenticate function/);
  });

  it("should fail if the sequelize instance does not have a config", () => {
    function sut() {
      new SequelizeDbHealthChecker({authenticate: () => {}});
    }
    assert.throws(sut, /Requires a sequelize object with a valid config/);
  });  

  it("should return 200 if everything is fine", async () => {
    const sequelize = {
        authenticate: () => {
          return Promise.resolve();
        },
        config: {}
      },
      checker = new SequelizeDbHealthChecker(sequelize);

    const result = await checker.checkStatus();
    assert.equal(result.name, "Sequelize DB");
    assert.equal(result.status, 200);
  });

  it("should allow a custom service name", async () => {
    const sequelize = {
        authenticate: () => {
          return Promise.resolve();
        },
        config: {}
      },    
      checker = new SequelizeDbHealthChecker(sequelize, {name: "MyService"});

    const result = await checker.checkStatus();
    assert.equal(result.name, "MyService");
    assert.equal(result.status, 200);
  });

  it("should return 500 if authenticate fails", async () => {
    const sequelize = {
        authenticate: () => {
          return Promise.reject();
        },
        config: {}
      },    
      checker = new SequelizeDbHealthChecker(sequelize, {name: "MyService"});

    const result = await checker.checkStatus();
    assert.equal(result.name, "MyService");
    assert.equal(result.status, 500);
  });
});
