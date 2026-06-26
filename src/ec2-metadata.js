function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(function () {
    controller.abort();
  }, timeoutMs);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(function () {
    clearTimeout(timeout);
  });
}

async function responseToBody(response) {
  const text = await response.text();
  return {
    status: response.status,
    text,
  };
}

module.exports = function(field, fn){
  fetchWithTimeout("http://169.254.169.254/latest/api/token", {
    method: "PUT",
    headers: {
      "X-aws-ec2-metadata-token-ttl-seconds": "21600",
    },
  }, 400)
    .then(responseToBody)
    .then(function (tokenResponse) {
      if (tokenResponse.status !== 200) {
        throw new Error(`${tokenResponse.status} - ${tokenResponse.text}`);
      }

      return fetchWithTimeout(`http://169.254.169.254/latest/meta-data/${field}`, {
        method: "GET",
        headers: {
          "X-aws-ec2-metadata-token": tokenResponse.text,
        },
      }, 400);
    })
    .then(responseToBody)
    .then(function (metadataResponse) {
      if (metadataResponse.status !== 200) {
        throw new Error(`${metadataResponse.status} - ${metadataResponse.text}`);
      }

      fn(null, metadataResponse.text);
    })
    .catch(function (err) {
      fn(err);
    });
};