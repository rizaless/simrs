# Unified Endpoint Management & Security Solution

Aplikasi Unified Endpoint Management (UEM) & Security Solution untuk mengawasi dan mengelola perangkat client dengan fitur keamanan terintegrasi.

## Fitur Utama

### 1. Manajemen Perangkat (Device Management)
- Registrasi perangkat client
- Monitoring status perangkat (online/offline)
- Pelacakan informasi sistem (OS, CPU, Memory, Network)
- Riwayat aktivitas perangkat

### 2. Keamanan (Security)
- Kebijakan keamanan yang dapat dikonfigurasi
- Pemeriksaan kepatuhan (compliance check)
- Deteksi pelanggaran kebijakan
- Enkripsi data sensitif
- Audit trail untuk pelanggaran

### 3. Client Agent
- Pengumpulan informasi sistem otomatis
- Pemeriksaan status keamanan
- Pelaporan berkala ke server
- Monitoring real-time

## Struktur Proyek

```
/workspace
├── src/
│   ├── index.js              # Server utama dengan API endpoints
│   ├── monitor.js            # Monitoring utilities (legacy)
│   ├── server/
│   │   └── deviceManager.js  # Manajemen perangkat
│   ├── security/
│   │   └── securityManager.js # Manajemen keamanan & compliance
│   ├── client/
│   │   ├── clientAgent.js    # Agent untuk perangkat client
│   │   └── demo.js           # Demo client agent
│   └── utils/                # Utility functions
├── package.json
└── README.md
```

## Instalasi

```bash
npm install
```

## Cara Menggunakan

### Menjalankan Server

```bash
# Production
npm start

# Development dengan auto-reload
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### Menjalankan Client Agent Demo

```bash
npm run client
```

## API Endpoints

### General
- `GET /` - Informasi API
- `GET /health` - Health check
- `GET /metrics` - Metrik sistem

### Device Management
- `GET /api/devices` - Ringkasan perangkat
- `GET /api/devices/list` - Daftar semua perangkat
- `GET /api/devices/:id` - Detail perangkat
- `POST /api/devices/register` - Registrasi perangkat baru
- `PUT /api/devices/:id/status` - Update status perangkat
- `DELETE /api/devices/:id` - Hapus perangkat

### Security Policies
- `GET /api/policies` - Daftar kebijakan keamanan
- `GET /api/policies/:id` - Detail kebijakan
- `POST /api/policies` - Buat kebijakan baru
- `PUT /api/policies/:id` - Update kebijakan
- `DELETE /api/policies/:id` - Hapus kebijakan

### Compliance
- `POST /api/compliance/check` - Periksa kepatuhan perangkat
- `GET /api/compliance/violations` - Daftar pelanggaran
- `GET /api/compliance/report` - Laporan keamanan

### Demo
- `POST /api/demo/setup` - Setup data demo (3 devices + 2 policies)

## Contoh Penggunaan

### 1. Setup Data Demo

```bash
curl -X POST http://localhost:3000/api/demo/setup
```

### 2. Registrasi Perangkat

```bash
curl -X POST http://localhost:3000/api/devices/register \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "DEVICE-001",
    "hostname": "workstation-01",
    "platform": "windows",
    "type": "desktop"
  }'
```

### 3. Membuat Kebijakan Keamanan

```bash
curl -X POST http://localhost:3000/api/policies \
  -H "Content-Type: application/json" \
  -d '{
    "policyId": "SECURITY-POLICY-001",
    "name": "Standard Security Policy",
    "requirePassword": true,
    "requireEncryption": true,
    "requireAntivirus": true,
    "requireFirewall": true,
    "minimumOSVersion": "10.0.0",
    "enabled": true
  }'
```

### 4. Memeriksa Kepatuhan

```bash
curl -X POST http://localhost:3000/api/compliance/check \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "DEVICE-001",
    "deviceState": {
      "passwordEnabled": true,
      "encryptionEnabled": false,
      "antivirusActive": true,
      "firewallEnabled": true,
      "osVersion": "10.0.19045"
    }
  }'
```

### 5. Mendapatkan Laporan Keamanan

```bash
curl http://localhost:3000/api/compliance/report
```

## Komponen Utama

### DeviceManager
Mengelola siklus hidup perangkat:
- Registrasi
- Update status
- Tracking online/offline
- Riwayat aktivitas

### SecurityManager
Mengelola aspek keamanan:
- Kebijakan keamanan
- Pemeriksaan compliance
- Deteksi pelanggaran
- Enkripsi data
- Laporan keamanan

### ClientAgent
Agent yang dijalankan di perangkat client:
- Mengumpulkan informasi sistem
- Memeriksa status keamanan
- Melapor ke server secara berkala
- Dapat dikontrol (start/stop)

## Teknologi

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Crypto** - Enkripsi data
- **OS module** - Informasi sistem

## Pengembangan

Untuk menambahkan fitur baru:

1. Tambahkan modul di folder yang sesuai (`server/`, `security/`, atau `client/`)
2. Import dan gunakan di `index.js`
3. Tambahkan endpoint API jika diperlukan
4. Update dokumentasi ini

## Lisensi

MIT License
