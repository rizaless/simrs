const os = require('os');

function formatBytes(bytes) {
  return {
    bytes,
    kilobytes: (bytes / 1024).toFixed(2),
    megabytes: (bytes / 1024 / 1024).toFixed(2),
    gigabytes: (bytes / 1024 / 1024 / 1024).toFixed(2)
  };
}

function getHealth() {
  return {
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    memory: {
      rss: os.totalmem() ? formatBytes(process.memoryUsage().rss) : null,
      heapTotal: formatBytes(process.memoryUsage().heapTotal),
      heapUsed: formatBytes(process.memoryUsage().heapUsed)
    },
    timestamp: new Date().toISOString()
  };
}

function getMetrics() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  return {
    system: {
      platform: os.platform(),
      arch: os.arch(),
      uptimeSeconds: Math.floor(os.uptime()),
      loadAverage: os.loadavg(),
      cpus: os.cpus().length
    },
    memory: {
      total: formatBytes(totalMemory),
      free: formatBytes(freeMemory),
      used: formatBytes(usedMemory),
      usagePercent: ((usedMemory / totalMemory) * 100).toFixed(2)
    },
    process: {
      pid: process.pid,
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      memoryUsage: {
        rss: formatBytes(process.memoryUsage().rss),
        heapTotal: formatBytes(process.memoryUsage().heapTotal),
        heapUsed: formatBytes(process.memoryUsage().heapUsed)
      }
    },
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  getHealth,
  getMetrics
};
