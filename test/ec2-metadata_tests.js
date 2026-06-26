const assert = require("node:assert/strict");
const {describe, it} = require("node:test");

const ec2Metadata = require("../src/ec2-metadata");

describe("ec2-metadata", function () {
  it("should use IMDSv2 token flow to resolve a metadata field", async function () {
    const originalFetch = global.fetch;
    const fetchCalls = [];

    global.fetch = async function (url, options = {}) {
      fetchCalls.push({url, options});

      if (url === "http://169.254.169.254/latest/api/token") {
        return {
          status: 200,
          text: async function () { return "token-123"; },
        };
      }

      if (url === "http://169.254.169.254/latest/meta-data/instance-id") {
        return {
          status: 200,
          text: async function () { return "i-abc"; },
        };
      }

      throw new Error(`Unexpected URL ${url}`);
    };

    try {
      const result = await new Promise(function (resolve, reject) {
        ec2Metadata("instance-id", function (err, value) {
          if (err) {
            return reject(err);
          }
          resolve(value);
        });
      });

      assert.equal(result, "i-abc");
      assert.equal(fetchCalls.length, 2);
      assert.equal(fetchCalls[0].url, "http://169.254.169.254/latest/api/token");
      assert.equal(fetchCalls[0].options.method, "PUT");
      assert.equal(fetchCalls[0].options.headers["X-aws-ec2-metadata-token-ttl-seconds"], "21600");
      assert.equal(fetchCalls[1].url, "http://169.254.169.254/latest/meta-data/instance-id");
      assert.equal(fetchCalls[1].options.method, "GET");
      assert.equal(fetchCalls[1].options.headers["X-aws-ec2-metadata-token"], "token-123");
    } finally {
      global.fetch = originalFetch;
    }
  });
});
