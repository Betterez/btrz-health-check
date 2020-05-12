const request = require("superagent");

module.exports = function(field, fn){
  request
    .get(`http://169.254.169.254/latest/meta-data/${field}`)
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
};