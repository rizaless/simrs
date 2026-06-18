const os = require('os');

class ClientAgent {
  constructor(deviceId, serverUrl) {
    this.deviceId = deviceId;
    this.serverUrl = serverUrl;
    this.collectionInterval = null;
    this.isRunning = false;
  }

  // Collect system information
  collectSystemInfo() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    
    return {
      deviceId: this.deviceId,
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      version: os.version(),
      cpus: os.cpus().map(cpu => ({
        model: cpu.model,
        speed: cpu.speed,
        times: cpu.times
      })),
      totalMemory,
      freeMemory,
      usedMemory: totalMemory - freeMemory,
      memoryUsagePercent: ((totalMemory - freeMemory) / totalMemory * 100).toFixed(2),
      networkInterfaces: this.getNetworkInterfaces(),
      uptime: os.uptime(),
      collectedAt: new Date().toISOString()
    };
  }

  getNetworkInterfaces() {
    const interfaces = os.networkInterfaces();
    const result = {};
    
    for (const [name, iface] of Object.entries(interfaces)) {
      result[name] = iface.filter(i => i.family === 'IPv4').map(i => ({
        address: i.address,
        netmask: i.netmask,
        mac: i.mac
      }));
    }
    
    return result;
  }

  // Check security state
  checkSecurityState() {
    // Note: These are simulated checks. In production, you'd integrate with actual security software
    return {
      deviceId: this.deviceId,
      passwordEnabled: true, // Would check actual system settings
      encryptionEnabled: this.checkEncryptionStatus(),
      antivirusActive: this.checkAntivirusStatus(),
      firewallEnabled: this.checkFirewallStatus(),
      osVersion: os.release(),
      lastSecurityScan: new Date().toISOString(),
      checkedAt: new Date().toISOString()
    };
  }

  checkEncryptionStatus() {
    // Simulated - in production would check BitLocker, FileVault, etc.
    const platform = os.platform();
    if (platform === 'win32') {
      // Would check Windows BitLocker status
      return true;
    } else if (platform === 'darwin') {
      // Would check macOS FileVault status
      return true;
    }
    return false;
  }

  checkAntivirusStatus() {
    // Simulated - in production would check actual antivirus software
    return true;
  }

  checkFirewallStatus() {
    // Simulated - in production would check actual firewall status
    return true;
  }

  // Get installed software list
  getInstalledSoftware() {
    // This is a placeholder - actual implementation would query system package managers
    return {
      deviceId: this.deviceId,
      software: [],
      collectedAt: new Date().toISOString()
    };
  }

  // Get running processes
  getRunningProcesses() {
    // Note: This requires additional permissions and might need native modules
    return {
      deviceId: this.deviceId,
      processCount: 0, // Would use ps-list or similar in production
      collectedAt: new Date().toISOString()
    };
  }

  // Send data to server
  async sendData(endpoint, data) {
    try {
      const response = await fetch(`${this.serverUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': this.deviceId
        },
        body: JSON.stringify(data)
      });
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to send data to ${endpoint}:`, error.message);
      throw error;
    }
  }

  // Start periodic collection and reporting
  startMonitoring(intervalMs = 60000) {
    if (this.isRunning) {
      console.log('Monitoring already running');
      return;
    }

    this.isRunning = true;
    console.log(`Starting monitoring for device ${this.deviceId}`);

    // Initial collection
    this.collectAndReport();

    // Periodic collection
    this.collectionInterval = setInterval(() => {
      this.collectAndReport();
    }, intervalMs);
  }

  collectAndReport() {
    try {
      const systemInfo = this.collectSystemInfo();
      const securityState = this.checkSecurityState();

      console.log(`[${new Date().toISOString()}] Collected data for ${this.deviceId}`);
      console.log(`  - Platform: ${systemInfo.platform}`);
      console.log(`  - Memory Usage: ${systemInfo.memoryUsagePercent}%`);
      console.log(`  - Security Compliant: ${securityState.encryptionEnabled && securityState.antivirusActive}`);

      // In production, would send to server:
      // this.sendData('/api/devices/report', { systemInfo, securityState });
    } catch (error) {
      console.error('Error collecting data:', error.message);
    }
  }

  stopMonitoring() {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
    }
    this.isRunning = false;
    console.log(`Stopped monitoring for device ${this.deviceId}`);
  }

  getStatus() {
    return {
      deviceId: this.deviceId,
      serverUrl: this.serverUrl,
      isRunning: this.isRunning,
      collectionInterval: this.collectionInterval ? 'active' : 'stopped'
    };
  }
}

module.exports = ClientAgent;
