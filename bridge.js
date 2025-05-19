const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// 🌐 InfluxDB Cloud Configuration
const token = process.env.INFLUXDB_TOKEN;
const org = '819f13aea2728692';
const bucket = 'aqi_project';
const url = 'https://us-east-1-1.aws.cloud2.influxdata.com';

const influxDB = new InfluxDB({ url, token });
const writeApi = influxDB.getWriteApi(org, bucket, 'ms');

const app = express();
const portServer = process.env.PORT || 10000;

const server = http.createServer(app);
const io = new Server(server);

// 🧾 Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// 📁 Serve static files
app.use(express.static(path.join(__dirname)));

// 📄 Root route
app.get('/', (req, res) => {
  res.sendFile('device1.html', { root: __dirname });
});

// 📦 Body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: 'application/vnd.flux' }));

// 📤 Upload route
app.post('/upload', async (req, res) => {
  try {
    console.log('Received upload request with body:', req.body);
    const { deviceId, co, no2, temperature, humidity, pm1_0, pm2_5, pm10 } = req.body;

    if (!deviceId || [co, no2, temperature, humidity, pm1_0, pm2_5, pm10].some(val => val === undefined)) {
      console.log('Missing sensor data fields:', req.body);
      return res.status(400).json({ error: 'Missing sensor data fields' });
    }

    const point = new Point('air_quality')
      .tag('device', deviceId)
      .floatField('CO', parseFloat(co))
      .floatField('NO2', parseFloat(no2))
      .floatField('Temperature', parseFloat(temperature))
      .floatField('Humidity', parseFloat(humidity))
      .intField('PM1_0', parseInt(pm1_0))
      .intField('PM2_5', parseInt(pm2_5))
      .intField('PM10', parseInt(pm10));

    writeApi.writePoint(point);
    await writeApi.flush();
    console.log(`✅ Data point written for device ${deviceId}`);

    // 🔁 Emit to device-specific event
    if (deviceId === "device1") {
      io.emit('newDataDevice1', { deviceId, co, no2, temperature, humidity, pm1_0, pm2_5, pm10 });
    } else if (deviceId === "device2") {
      io.emit('newDataDevice2', { deviceId, co, no2, temperature, humidity, pm1_0, pm2_5, pm10 });
    }

    res.status(200).json({ message: 'Data uploaded successfully' });
  } catch (error) {
    console.error('❌ Error processing upload:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 📊 Query InfluxDB
app.post('/query', async (req, res) => {
  const query = req.body;
  console.log('Received query request with body:', query);
  if (!query) return res.status(400).send('Missing Flux query');

  try {
    const queryApi = influxDB.getQueryApi(org);
    let csvData = '';

    const fluxObserver = {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        csvData += Object.values(o).join(',') + '\n';
      },
      error(err) {
        console.error('❌ Query failed', err);
        res.status(500).send('Query failed: ' + err.message);
      },
      complete() {
        res.setHeader('Content-Type', 'text/csv');
        res.send(csvData);
      },
    };

    queryApi.queryRows(query, fluxObserver);
  } catch (error) {
    console.error('❌ Error executing query', error);
    res.status(500).send('Error executing query: ' + error.message);
  }
});

// 🔌 Start server
server.listen(portServer, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${portServer}`);
});

// 🛑 Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down...');
  await writeApi.close();
  process.exit(0);
});
