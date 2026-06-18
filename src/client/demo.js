const ClientAgent = require('./clientAgent');

// Demo script to show client agent functionality
async function runDemo() {
  console.log('===========================================');
  console.log('UEM Client Agent Demo');
  console.log('===========================================\n');

  // Create a client agent instance
  const agent = new ClientAgent('DEMO-DEVICE-001', 'http://localhost:3000');

  console.log('1. Collecting System Information...\n');
  const systemInfo = agent.collectSystemInfo();
  console.log('Device ID:', systemInfo.deviceId);
  console.log('Hostname:', systemInfo.hostname);
  console.log('Platform:', systemInfo.platform);
  console.log('Architecture:', systemInfo.arch);
  console.log('OS Version:', systemInfo.release);
  console.log('CPU Cores:', systemInfo.cpus.length);
  console.log('Total Memory:', (systemInfo.totalMemory / 1024 / 1024 / 1024).toFixed(2), 'GB');
  console.log('Memory Usage:', systemInfo.memoryUsagePercent, '%');
  console.log('Uptime:', (systemInfo.uptime / 3600).toFixed(2), 'hours\n');

  console.log('2. Checking Security State...\n');
  const securityState = agent.checkSecurityState();
  console.log('Device ID:', securityState.deviceId);
  console.log('Password Enabled:', securityState.passwordEnabled);
  console.log('Encryption Enabled:', securityState.encryptionEnabled);
  console.log('Antivirus Active:', securityState.antivirusActive);
  console.log('Firewall Enabled:', securityState.firewallEnabled);
  console.log('OS Version:', securityState.osVersion);
  console.log('Last Security Scan:', securityState.lastSecurityScan, '\n');

  console.log('3. Starting Monitoring (will run for 5 seconds)...\n');
  
  agent.startMonitoring(2000); // Collect every 2 seconds

  // Let it run for 5 seconds
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('\n4. Stopping Monitoring...\n');
  agent.stopMonitoring();

  console.log('\n5. Agent Status:');
  const status = agent.getStatus();
  console.log('Device ID:', status.deviceId);
  console.log('Server URL:', status.serverUrl);
  console.log('Is Running:', status.isRunning);
  console.log('Collection Interval:', status.collectionInterval);

  console.log('\n===========================================');
  console.log('Demo Complete!');
  console.log('===========================================');
  console.log('\nTo use with the server:');
  console.log('1. Start the server: npm start');
  console.log('2. Run this demo in another terminal: npm run client');
  console.log('3. The agent will collect and send data to the server\n');
}

// Run the demo
runDemo().catch(console.error);
