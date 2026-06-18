const express = require('express');
const DeviceManager = require('./server/deviceManager');
const SecurityManager = require('./security/securityManager');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize managers
const deviceManager = new DeviceManager();
const securityManager = new SecurityManager();

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'UEM Security Solution',
    version: '1.0.0',
    description: 'Unified Endpoint Management & Security Solution',
    endpoints: [
      '/health',
      '/metrics',
      '/api/devices',
      '/api/policies',
      '/api/compliance',
      '/api/reports'
    ]
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// System metrics
app.get('/metrics', (req, res) => {
  const os = require('os');
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  
  res.json({
    system: {
      platform: os.platform(),
      arch: os.arch(),
      uptime: os.uptime(),
      loadAverage: os.loadavg(),
      cpus: os.cpus().length
    },
    memory: {
      total: totalMemory,
      free: freeMemory,
      used: totalMemory - freeMemory,
      usagePercent: ((totalMemory - freeMemory) / totalMemory * 100).toFixed(2)
    },
    process: {
      pid: process.pid,
      uptime: process.uptime(),
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage()
    },
    timestamp: new Date().toISOString()
  });
});

// Device Management API
app.get('/api/devices', (req, res) => {
  const overview = deviceManager.getSystemOverview();
  res.json(overview);
});

app.get('/api/devices/list', (req, res) => {
  const devices = deviceManager.getAllDevices();
  res.json({ devices, count: devices.length });
});

app.get('/api/devices/:id', (req, res) => {
  const device = deviceManager.getDevice(req.params.id);
  if (!device) {
    return res.status(404).json({ error: 'Device not found' });
  }
  res.json(device);
});

app.post('/api/devices/register', (req, res) => {
  try {
    const { deviceId, hostname, platform, type } = req.body;
    
    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId is required' });
    }
    
    const device = deviceManager.registerDevice(deviceId, {
      hostname,
      platform,
      type: type || 'unknown'
    });
    
    res.status(201).json({ message: 'Device registered successfully', device });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/devices/:id/status', (req, res) => {
  try {
    const updates = req.body;
    const device = deviceManager.updateDeviceStatus(req.params.id, updates);
    res.json({ message: 'Device status updated', device });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/devices/:id', (req, res) => {
  const removed = deviceManager.removeDevice(req.params.id);
  if (removed) {
    res.json({ message: 'Device removed successfully' });
  } else {
    res.status(404).json({ error: 'Device not found' });
  }
});

// Security Policy API
app.get('/api/policies', (req, res) => {
  const policies = securityManager.getAllPolicies();
  res.json({ policies, count: policies.length });
});

app.get('/api/policies/:id', (req, res) => {
  const policy = securityManager.getPolicy(req.params.id);
  if (!policy) {
    return res.status(404).json({ error: 'Policy not found' });
  }
  res.json(policy);
});

app.post('/api/policies', (req, res) => {
  try {
    const { policyId, name, requirePassword, requireEncryption, requireAntivirus, requireFirewall, minimumOSVersion, enabled } = req.body;
    
    if (!policyId) {
      return res.status(400).json({ error: 'policyId is required' });
    }
    
    const policy = securityManager.createSecurityPolicy(policyId, {
      name: name || policyId,
      requirePassword: requirePassword || false,
      requireEncryption: requireEncryption || false,
      requireAntivirus: requireAntivirus || false,
      requireFirewall: requireFirewall || false,
      minimumOSVersion: minimumOSVersion || null,
      enabled: enabled !== false
    });
    
    res.status(201).json({ message: 'Policy created successfully', policy });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/policies/:id', (req, res) => {
  try {
    const policy = securityManager.updatePolicy(req.params.id, req.body);
    res.json({ message: 'Policy updated successfully', policy });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/policies/:id', (req, res) => {
  const deleted = securityManager.deletePolicy(req.params.id);
  if (deleted) {
    res.json({ message: 'Policy deleted successfully' });
  } else {
    res.status(404).json({ error: 'Policy not found' });
  }
});

// Compliance Check API
app.post('/api/compliance/check', (req, res) => {
  try {
    const { deviceId, deviceState } = req.body;
    
    if (!deviceId || !deviceState) {
      return res.status(400).json({ error: 'deviceId and deviceState are required' });
    }
    
    const result = securityManager.checkCompliance(deviceId, deviceState);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/compliance/violations', (req, res) => {
  const { deviceId, limit } = req.query;
  const violations = securityManager.getViolations(deviceId || null, parseInt(limit) || 100);
  res.json({ violations, count: violations.length });
});

app.get('/api/compliance/report', (req, res) => {
  const report = securityManager.generateSecurityReport();
  res.json(report);
});

// Demo endpoint to setup sample data
app.post('/api/demo/setup', (req, res) => {
  // Register sample devices
  deviceManager.registerDevice('DEV001', {
    hostname: 'workstation-01',
    platform: 'windows',
    type: 'desktop'
  });
  
  deviceManager.registerDevice('DEV002', {
    hostname: 'laptop-hr-05',
    platform: 'macos',
    type: 'laptop'
  });
  
  deviceManager.registerDevice('DEV003', {
    hostname: 'server-prod-01',
    platform: 'linux',
    type: 'server'
  });
  
  // Create security policies
  securityManager.createSecurityPolicy('POL001', {
    name: 'Standard Security Policy',
    requirePassword: true,
    requireEncryption: true,
    requireAntivirus: true,
    requireFirewall: true,
    minimumOSVersion: '10.0.0',
    enabled: true
  });
  
  securityManager.createSecurityPolicy('POL002', {
    name: 'High Security Policy',
    requirePassword: true,
    requireEncryption: true,
    requireAntivirus: true,
    requireFirewall: true,
    minimumOSVersion: '11.0.0',
    enabled: true
  });
  
  res.json({
    message: 'Demo data setup complete',
    devices: deviceManager.getAllDevices().length,
    policies: securityManager.getAllPolicies().length
  });
});

// Start server
app.listen(port, () => {
  console.log(`===========================================`);
  console.log(`UEM Security Solution Server`);
  console.log(`===========================================`);
  console.log(`Server running on http://localhost:${port}`);
  console.log(``);
  console.log(`Available Endpoints:`);
  console.log(`  GET  /                    - API Info`);
  console.log(`  GET  /health              - Health Check`);
  console.log(`  GET  /metrics             - System Metrics`);
  console.log(`  GET  /api/devices         - Device Overview`);
  console.log(`  GET  /api/devices/list    - List All Devices`);
  console.log(`  POST /api/devices/register - Register Device`);
  console.log(`  GET  /api/policies        - List Security Policies`);
  console.log(`  POST /api/policies        - Create Policy`);
  console.log(`  POST /api/compliance/check - Check Compliance`);
  console.log(`  GET  /api/compliance/report - Security Report`);
  console.log(`  POST /api/demo/setup      - Setup Demo Data`);
  console.log(`===========================================`);
});
