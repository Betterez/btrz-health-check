const request = require("superagent");

module.exports = function(field, fn){
  request
    .put("http://169.254.169.254/latest/api/token")
    .set("X-aws-ec2-metadata-token-ttl-seconds", "21600")
    .timeout(400)
    .end(function(err, res) {
      if (err) {
        return fn(err);
      }
      if (res.status !== 200) {
        return fn(new Error(`${res.status} - ${res.text}`));
      }

      request
        .get(`http://169.254.169.254/latest/meta-data/${field}`)
        .set("X-aws-ec2-metadata-token", res.text)
        .timeout(400)
        .end(function (err, res) {
          if (err) {
            return fn(err);
          }
          if (res.status !== 200) {
            return fn(new Error(`${res.status} - ${res.text}`));
          }
          fn(null, res.text);
        });
    });
};