const express = require('express');
const monitor = require('./monitor');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    name: 'simrs-monitoring',
    status: 'running',
    routes: ['/health', '/metrics']
  });
});

app.get('/health', (req, res) => {
  res.json(monitor.getHealth());
});

app.get('/metrics', (req, res) => {
  res.json(monitor.getMetrics());
});

app.listen(port, () => {
  console.log(`Monitoring service listening on http://localhost:${port}`);
});
