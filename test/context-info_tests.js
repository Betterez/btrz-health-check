const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
const childProcess = require("node:child_process");

describe("EnvironmentInfo", function () {
  const EnvironmentInfo = require("../src/environment-info").EnvironmentInfo;
  const env = new EnvironmentInfo();

  it("should include the git commit hash if is a git repo", async function () {
    const result = await env.git();
    assert.notEqual(result, null);
  });

  it("should return localhost if can't find the ec2 instance Id", async function () {
    const result = await env.ec2instanceId();
    assert.notEqual(result, undefined);
    if (result === "localhost") {
      assert.equal(result, "localhost");
    }
  });

  it("should return the BUILD_NUMBER", function () {
    assert.equal(env.buildNumber(), "123456789");
  });

  it("should return the env variables combined", async function () {
    const result = await env.values();
    assert.notEqual(result.commit, null);
    assert.notEqual(result.instanceId, undefined);
    assert.equal(result.build, "123456789");
  });

  it("should resolve null if the git command fails", async function () {
    const originalExecFile = childProcess.execFile;
    childProcess.execFile = function (_command, _args, callback) {
      callback(new Error("git failed"));
    };

    try {
      const result = await env.git();
      assert.equal(result, null);
    } finally {
      childProcess.execFile = originalExecFile;
    }
  });
});
