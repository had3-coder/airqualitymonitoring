  const http = require('http');

const data = JSON.stringify({
  co: 19,
  no2: 23,
  temperature: 22.5,
  humidity: 45,
  pm1_0: 10,
  pm2_5: 20,
  pm10: 30
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log("Status: " + res.statusCode);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
