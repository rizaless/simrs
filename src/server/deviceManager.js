const os = require('os');
const fs = require('fs');
const path = require('path');

class DeviceManager {
  constructor() {
    this.devices = new Map();
    this.deviceHistory = [];
  }

  registerDevice(deviceId, deviceInfo) {
    const device = {
      id: deviceId,
      ...deviceInfo,
      status: 'online',
      lastSeen: new Date().toISOString(),
      registeredAt: new Date().toISOString()
    };
    
    this.devices.set(deviceId, device);
    this.logEvent('DEVICE_REGISTERED', { deviceId, deviceInfo });
    
    return device;
  }

  updateDeviceStatus(deviceId, updates) {
    if (!this.devices.has(deviceId)) {
      throw new Error(`Device ${deviceId} not found`);
    }

    const device = this.devices.get(deviceId);
    const updatedDevice = {
      ...device,
      ...updates,
      lastSeen: new Date().toISOString()
    };

    this.devices.set(deviceId, updatedDevice);
    this.logEvent('DEVICE_UPDATED', { deviceId, updates });

    return updatedDevice;
  }

  getDevice(deviceId) {
    return this.devices.get(deviceId) || null;
  }

  getAllDevices() {
    return Array.from(this.devices.values());
  }

  getOnlineDevices() {
    return this.getAllDevices().filter(d => d.status === 'online');
  }

  getOfflineDevices() {
    return this.getAllDevices().filter(d => d.status === 'offline');
  }

  removeDevice(deviceId) {
    const device = this.devices.get(deviceId);
    if (device) {
      this.devices.delete(deviceId);
      this.logEvent('DEVICE_REMOVED', { deviceId });
      return true;
    }
    return false;
  }

  logEvent(eventType, data) {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      data
    };
    
    this.deviceHistory.push(event);
    
    // Keep only last 1000 events
    if (this.deviceHistory.length > 1000) {
      this.deviceHistory = this.deviceHistory.slice(-1000);
    }
  }

  getDeviceHistory(deviceId, limit = 50) {
    return this.deviceHistory
      .filter(e => e.data.deviceId === deviceId)
      .slice(-limit);
  }

  getSystemOverview() {
    const allDevices = this.getAllDevices();
    return {
      totalDevices: allDevices.length,
      onlineDevices: this.getOnlineDevices().length,
      offlineDevices: this.getOfflineDevices().length,
      platform: os.platform(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = DeviceManager;
