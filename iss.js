const request = require("request");

const fetchMyIP = function (callback) {
  const website = 'https://api.ipify.org?format=json';
  request(website, (error, response, body) => {

    if (error) { // checks for errors
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) { // checks status code
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
    return ip

  });
};

const fetchCoordsByIP = function (ip, callback) {
  const website = `https://freegeoip.app/json/${ip}`;

  request(website, (error, response, body) => {
    if (error) { // checks for errors
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) { // checks status code
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const latitude = JSON.parse(body).latitude;
    const longitude = JSON.parse(body).longitude;
    // console.log(body)
    callback(null, { longitude, latitude });
    return { longitude, latitude };
  });
};

const fetchISSFlyOverTimes = function (coords, callback) {
  const longitude = coords.longitude;
  const latitude = coords.latitude;
  const website = `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  request(website, (error, response, body) => {
    if (error) { // checks for errors
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) { // checks status code
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const coords = JSON.parse(body).response;
    callback(null, coords);
  });
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };