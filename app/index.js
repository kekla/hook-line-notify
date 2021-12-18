const port = 3000;
const express = require('express');
const axios = require('axios');
const app = express();

const apiPath = process.env.API_PATH || '/';
const lineToken = process.env.LINE_TOKEN || '';
const lineApiPath = 'https://notify-api.line.me/api/notify';

app.get(apiPath, async (req, res) => {
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${lineToken}`
    }
  };
  try {
    const response = await axios.post(lineApiPath, 'message=開門囉', config);
    res.send(response.data);
  } catch (error) {
    console.log(error.response.data);
  }
});

app.listen(port, () => {

});