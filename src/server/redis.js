const redis = require("redis");
const Redisclient = redis.createClient();

export default () => {

  Redisclient.on("ready", function (err) {
      console.log("Ready");
  });

  Redisclient.on("error", function (err) {
      console.log("Error " + err);
  });
}

exports.Redisclient = Redisclient;

