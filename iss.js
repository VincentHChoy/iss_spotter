const request = require("request");

const fetchMyIP = function(callback) {
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
    console.log(typeof ip);
    callback(null, ip);

  });
};

module.exports = { fetchMyIP };