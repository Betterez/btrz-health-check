"use strict";
const ServiceStatus = require("./service-status").ServiceStatus;

class SequelizeDbHealthChecker {
  constructor(sequelize, options) {
    if (!sequelize) {
      throw new Error("Requires a valid sequelize object");
    }

    if (typeof sequelize.authenticate !== "function"){
      throw new Error("Requires a sequelize object that implements the authenticate function");
    }

    if (!sequelize.config) {
      throw new Error("Requires a sequelize object with a valid config");
    }

    this.sequelize = sequelize;
    this.serviceStatus = new ServiceStatus("Sequelize DB", options);
  }

  checkStatus() {    
    return this.sequelize.authenticate(this.sequelize.config)
      .then(() => {
        return this.serviceStatus.success();
      })
      .catch((err) => {
        return this.serviceStatus.fails(err)
      });
  }
}

exports.SequelizeDbHealthChecker = SequelizeDbHealthChecker;
