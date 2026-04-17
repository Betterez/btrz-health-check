const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
const net = require("node:net");

describe("SocketHealthChecker", function () {
  const SocketHealthChecker = require("../src/socket-health-checker").SocketHealthChecker;
  async function createListeningServer() {
    const server = net.createServer((socket) => {
      socket.destroy();
    });
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    return server;
  }

  async function closeServer(server) {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }


  async function getUnusedPort() {
    return new Promise((resolve, reject) => {
      const server = net.createServer();
      server.once("error", reject);
      server.listen(0, "127.0.0.1", () => {
        const { port } = server.address();
        server.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(port);
        });
      });
    });
  }

  it("should throw if not config is given", function () {
    function sut() {
      new SocketHealthChecker();
    }
    assert.throws(sut);
  });

  it("should throw if not host in config", function () {
    function sut() {
      new SocketHealthChecker({port: 1010});
    }
    assert.throws(sut);
  });

  it("should throw if not port in config", function () {
    function sut() {
      new SocketHealthChecker({host: "1.1.1.1"});
    }
    assert.throws(sut);
  });


  it("should connecto to a listening server", async function () {
    const server = await createListeningServer();
    const { port } = server.address();
    const config = {port, host: "127.0.0.1"};
    const checker = new SocketHealthChecker(config);
    try {
      const result = await checker.checkStatus();
      assert.equal(result.name, "Socket");
      assert.equal(result.status, 200);
    } finally {
      await closeServer(server);
    }
  });

  it("should return 500 if connection is refused", async function () {
    const unusedPort = await getUnusedPort();
    const config = {
      host: "127.0.0.1",
      port: unusedPort
    };
    const checker = new SocketHealthChecker(config);
    await assert.rejects(checker.checkStatus(), (result) => {
      assert.equal(result.name, "Socket");
      assert.equal(result.status, 500);
      return true;
    });
  });

  it("should return 500 and a custom name", async function () {
    const unusedPort = await getUnusedPort();
    const config = {
      host: "127.0.0.1",
      port: unusedPort
    };
    const checker = new SocketHealthChecker(config, {name: "UDP"});
    await assert.rejects(checker.checkStatus(), (result) => {
      assert.equal(result.name, "UDP");
      assert.equal(result.status, 500);
      return true;
    });
  });

  it("should call the logger if given", async function () {
    const unusedPort = await getUnusedPort();
    const config = {
      host: "127.0.0.1",
      port: unusedPort
    };
    const options = {
      logger: {
        error: function () {
        }
      }
    };
    const checker = new SocketHealthChecker(config, options);
    await assert.rejects(checker.checkStatus(), (err) => {
      assert.equal(err.name, "Socket");
      assert.equal(err.status, 500);
      return true;
    });
  });
});
