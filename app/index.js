const httpPort = 3000;
const httpsPort = 3001;
const express = require('express');
const axios = require('axios');
const app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');

const externalApiPath = process.env.EXTERNAL_API_PATH || '/';
const externalApiRequiredParam = process.env.EXTERNAL_API_REQUIRED_PARAM || 'require_param';
const doorApiHost = process.env.DOOR_API_HOST || '';
const doorApiPath = process.env.DOOR_API_PATH || '';
const relayLineApiPath = process.env.RELAY_LINE_API_PATH || '/';
const lineToken = process.env.LINE_TOKEN || '';
const lineApiPath = 'https://notify-api.line.me/api/notify';

app.use(express.json());
app.use(express.urlencoded());
app.post(externalApiPath, async (req, res) => {
  console.log(req.body);
  if (req.body[externalApiRequiredParam] !== '1') {
    res.status(401).send({
      result: false,
      code: 400
    });
    return;
  }
  if (req.body.door_user === undefined || req.body.door_user === null || req.body.door_user === '') {
    res.status(401).send({
      result: false,
      code: 401
    });
    return;
  }

  console.log('door_user: ', req.body.door_user);
  try {
    const query = Object.assign({}, req.body);
    delete query.door_user;
    delete query[externalApiRequiredParam];
    let url = `${doorApiHost}${doorApiPath}`;
    const queryString = Object.keys(query).map((key) => {return [key, query[key]].join('=')}).join('&');
    url = [url, queryString].join('?');
    console.log(url);
    const response = await axios.post(url);
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    console.log(error.response.data);
  }
});

app.get(relayLineApiPath, async (req, res) => {
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${lineToken}`
    }
  };
  try {
    const response = await axios.post(lineApiPath, 'message=開門囉', config);
    console.log('Door opened, send line notify.');
    res.send(response.data);
  } catch (error) {
    console.log(error.response.data);
  }
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer({
  key: fs.readFileSync('./private-key.pem'),
  cert: fs.readFileSync('./cert.pem')
}, app);

httpServer.listen(httpPort, () => {
  console.log(`Http listening on port ${httpPort}`);
  console.log(`External api path: ${externalApiPath}`);
  console.log(`Relay line api Path: ${relayLineApiPath}`);
});
httpsServer.listen(httpsPort, () => {
  console.log(`Https listening on port ${httpsPort}`);
  console.log(`External api path: ${externalApiPath}`);
  console.log(`Relay line api Path: ${relayLineApiPath}`);
});