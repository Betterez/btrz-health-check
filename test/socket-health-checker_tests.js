"use strict";

describe("SocketHealthChecker", function () {

  let SocketHealthChecker = require("../src/socket-health-checker").SocketHealthChecker,
    SocketServer = require("./helpers/socket-server").SocketServer,
    expect = require("chai").expect;

  it("should throw if not config is given", function () {
    function sut() {
      new SocketHealthChecker();
    }
    expect(sut).to.throw();
  });

  it("should throw if not host in config", function () {
    function sut() {
      new SocketHealthChecker({port: 1010});
    }
    expect(sut).to.throw();
  });

  it("should throw if not port in config", function () {
    function sut() {
      new SocketHealthChecker({host: "1.1.1.1"});
    }
    expect(sut).to.throw();
  });


  it("should connecto to a listening server", function (done) {
    let config = {port: 8765, host: "localhost"},
    checker = new SocketHealthChecker(config),
    server = new SocketServer(config.port);
    checker.checkStatus().then(function (result) {
      server.close();
      expect(result.name).to.be.eql("Socket");
      expect(result.status).to.be.eql(200);
      done();
    });

  });

  it("should return 500 if connection is refused", function (done) {
    let config = {
      host: "127.0.0.1",
      port: "80"
    },
    checker = new SocketHealthChecker(config);
    checker.checkStatus().catch(function (result) {
      expect(result.name).to.be.eql("Socket");
      expect(result.status).to.be.eql(500);
      done();
    });
  });

  it("should return 500 and a custom name", function (done) {
    let config = {
      host: "127.0.0.1",
      port: "80"
    },
    checker = new SocketHealthChecker(config, {name: "UDP"});
    checker.checkStatus().catch(function (result) {
      expect(result.name).to.be.eql("UDP");
      expect(result.status).to.be.eql(500);
      done();
    });
  });

  it("should call the logger if given", function (done) {
    let config = {
      host: "127.0.0.1",
      port: "80"
    },
    options = {
      logger: {
        error: function (name, err) {
          expect(name).to.be.eql("Socket");
          expect(err).not.to.be.null;
          done();
        }
      }
    },
    checker = new SocketHealthChecker(config, options);
    checker.checkStatus();
  });
});
