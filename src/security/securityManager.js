const crypto = require('crypto');

class SecurityManager {
  constructor() {
    this.policies = new Map();
    this.violations = [];
    this.encryptionKey = crypto.randomBytes(32);
  }

  createSecurityPolicy(policyId, policy) {
    const securityPolicy = {
      id: policyId,
      ...policy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.policies.set(policyId, securityPolicy);
    return securityPolicy;
  }

  getPolicy(policyId) {
    return this.policies.get(policyId) || null;
  }

  getAllPolicies() {
    return Array.from(this.policies.values());
  }

  updatePolicy(policyId, updates) {
    if (!this.policies.has(policyId)) {
      throw new Error(`Policy ${policyId} not found`);
    }

    const policy = this.policies.get(policyId);
    const updatedPolicy = {
      ...policy,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.policies.set(policyId, updatedPolicy);
    return updatedPolicy;
  }

  deletePolicy(policyId) {
    return this.policies.delete(policyId);
  }

  // Check device compliance with security policies
  checkCompliance(deviceId, deviceState) {
    const violations = [];
    const policies = this.getAllPolicies();

    for (const policy of policies) {
      if (policy.enabled === false) continue;

      // Check password policy
      if (policy.requirePassword && !deviceState.passwordEnabled) {
        violations.push({
          policyId: policy.id,
          violation: 'PASSWORD_REQUIRED',
          message: 'Device requires password protection',
          severity: 'high',
          timestamp: new Date().toISOString()
        });
      }

      // Check encryption policy
      if (policy.requireEncryption && !deviceState.encryptionEnabled) {
        violations.push({
          policyId: policy.id,
          violation: 'ENCRYPTION_REQUIRED',
          message: 'Device requires disk encryption',
          severity: 'critical',
          timestamp: new Date().toISOString()
        });
      }

      // Check antivirus policy
      if (policy.requireAntivirus && !deviceState.antivirusActive) {
        violations.push({
          policyId: policy.id,
          violation: 'ANTIVIRUS_REQUIRED',
          message: 'Device requires active antivirus',
          severity: 'high',
          timestamp: new Date().toISOString()
        });
      }

      // Check firewall policy
      if (policy.requireFirewall && !deviceState.firewallEnabled) {
        violations.push({
          policyId: policy.id,
          violation: 'FIREWALL_REQUIRED',
          message: 'Device requires firewall enabled',
          severity: 'medium',
          timestamp: new Date().toISOString()
        });
      }

      // Check OS version policy
      if (policy.minimumOSVersion && deviceState.osVersion) {
        if (this.compareVersions(deviceState.osVersion, policy.minimumOSVersion) < 0) {
          violations.push({
            policyId: policy.id,
            violation: 'OS_VERSION_OUTDATED',
            message: `Device OS version ${deviceState.osVersion} is below minimum ${policy.minimumOSVersion}`,
            severity: 'medium',
            timestamp: new Date().toISOString()
          });
        }
      }
    }

    // Store violations
    if (violations.length > 0) {
      this.violations.push({
        deviceId,
        violations,
        checkedAt: new Date().toISOString()
      });

      // Keep only last 500 violations
      if (this.violations.length > 500) {
        this.violations = this.violations.slice(-500);
      }
    }

    return {
      deviceId,
      compliant: violations.length === 0,
      violations,
      checkedAt: new Date().toISOString()
    };
  }

  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const num1 = parts1[i] || 0;
      const num2 = parts2[i] || 0;
      
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    
    return 0;
  }

  getViolations(deviceId = null, limit = 100) {
    if (deviceId) {
      return this.violations
        .filter(v => v.deviceId === deviceId)
        .slice(-limit);
    }
    return this.violations.slice(-limit);
  }

  // Encrypt sensitive data
  encrypt(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      iv: iv.toString('hex'),
      data: encrypted
    };
  }

  // Decrypt sensitive data
  decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.encryptionKey,
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }

  generateSecurityReport() {
    const allViolations = this.violations;
    const violationCounts = {};
    
    allViolations.forEach(record => {
      record.violations.forEach(v => {
        violationCounts[v.violation] = (violationCounts[v.violation] || 0) + 1;
      });
    });

    return {
      totalViolations: allViolations.length,
      violationsByType: violationCounts,
      policiesCount: this.policies.size,
      generatedAt: new Date().toISOString()
    };
  }

  clearViolations(deviceId = null) {
    if (deviceId) {
      this.violations = this.violations.filter(v => v.deviceId !== deviceId);
    } else {
      this.violations = [];
    }
  }
}

module.exports = SecurityManager;
