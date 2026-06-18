# Unified Endpoint Management & Security Solution

Solusi terpusat untuk manajemen dan keamanan perangkat endpoint (UEM) yang memungkinkan administrator untuk mengawasi, mengelola kebijakan keamanan, dan memantau kepatuhan (compliance) perangkat client secara real-time.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Cara Menjalankan](#cara-menjalankan)
- [Dokumentasi API](#dokumentasi-api)
- [Struktur Proyek](#struktur-proyek)
- [Keamanan](#keamanan)
- [Lisensi](#lisensi)

---

## ✨ Fitur Utama

### 1. Manajemen Perangkat (Device Management)
- **Registrasi Otomatis**: Perangkat client dapat mendaftarkan diri ke server pusat.
- **Status Real-time**: Melacak status online/offline perangkat.
- **Inventaris Hardware**: Mengumpulkan informasi spesifikasi perangkat (OS, CPU, RAM, Disk).

### 2. Kebijakan Keamanan (Security Policies)
- **Konfigurasi Terpusat**: Atur kebijakan keamanan dari server untuk semua client.
- **Parameter Kebijakan**:
  - Panjang minimal password.
  - Wajib enkripsi disk.
  - Status antivirus dan firewall.
  - Versi minimum sistem operasi.

### 3. Kepatuhan & Audit (Compliance & Auditing)
- **Compliance Checking**: Verifikasi otomatis apakah perangkat mematuhi kebijakan.
- **Deteksi Pelanggaran**: Identifikasi perangkat yang tidak aman.
- **Laporan Keamanan**: Generate laporan detail tentang status keamanan seluruh jaringan.

### 4. Agen Client (Client Agent)
- **Ringan**: Dibuat dengan Node.js untuk performa minimal.
- **Pengumpulan Data**: Mengirimkan metrik sistem dan status keamanan ke server.
- **Simulasi**: Mode demo untuk mensimulasikan berbagai skenario keamanan.

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────┐
│   Server UEM Pusat  │
│   (Express.js API)  │
└──────────┬──────────┘
           │
    ┌──────┼──────┬──────────┐
    │      │      │          │
    ▼      ▼      ▼          ▼
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│Client│ │Client│ │Client│ │Client│
│  1   │ │  2   │ │  3   │ │  N   │
└──────┘ └──────┘ └──────┘ └──────┘
```

- **Server**: Berbasis Express.js, menangani API, penyimpanan data (in-memory untuk demo), dan logika bisnis.
- **Client Agent**: Script Node.js yang berjalan di endpoint, mengumpulkan data, dan melaporkan ke server.
- **Komunikasi**: REST API over HTTP/HTTPS.

---

## 🛠️ Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/) (versi 14.x atau lebih baru)
- [npm](https://www.npmjs.com/) (terinstal bersama Node.js)
- Postman atau cURL (untuk testing API)

---

## 📥 Instalasi

1. **Clone Repositori**
   ```bash
   git clone <url-repositori-anda>
   cd unified-endpoint-management
   ```

2. **Instal Dependensi**
   ```bash
   npm install
   ```
   *Dependensi utama: `express`, `cors`, `uuid`, `axios`.*

---

## ⚙️ Konfigurasi

Anda dapat menyesuaikan konfigurasi server dengan mengedit variabel lingkungan atau file konfigurasi (jika ada). Secara default:

- **Port Server**: `3000`
- **Interval Heartbeat**: `30000` ms (30 detik)
- **Enkripsi**: AES-256-CBC (untuk data sensitif)

---

## 🚀 Cara Menjalankan

### 1. Menjalankan Server UEM
Jalankan server pusat untuk menerima koneksi dari client.

```bash
npm start
```
Server akan berjalan di `http://localhost:3000`.

### 2. Menjalankan Client Agent (Demo)
Jalankan agen client untuk mensimulasikan perangkat yang terhubung.

```bash
npm run client
```
*Script ini akan mendaftarkan perangkat palsu, mengirim data statistik, dan mensimulasikan status keamanan.*

### 3. Menjalankan Mode Development
Jika Anda ingin mengembangkan fitur lebih lanjut dengan auto-reload:

```bash
npm run dev
```

---

## 📡 Dokumentasi API

Berikut adalah endpoint API yang tersedia untuk interaksi dengan sistem.

### Device Management

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/devices` | Ringkasan semua perangkat |
| `GET` | `/api/devices/list` | Daftar detail semua perangkat |
| `GET` | `/api/devices/:id` | Mendapatkan detail spesifik perangkat berdasarkan ID. |
| `POST` | `/api/devices/register` | Mendaftarkan perangkat baru ke sistem. |
| `PUT` | `/api/devices/:id/status` | Update status perangkat |
| `DELETE` | `/api/devices/:id` | Menghapus perangkat dari sistem. |

### Security Policies

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/policies` | Mendapatkan daftar kebijakan keamanan saat ini. |
| `GET` | `/api/policies/:id` | Detail kebijakan spesifik |
| `POST` | `/api/policies` | Membuat kebijakan keamanan baru. |
| `PUT` | `/api/policies/:id` | Memperbarui kebijakan keamanan. |
| `DELETE` | `/api/policies/:id` | Menghapus kebijakan |

### Compliance & Reporting

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/compliance/check` | Memicu pemeriksaan kepatuhan untuk perangkat. |
| `GET` | `/api/compliance/violations` | Daftar pelanggaran kepatuhan |
| `GET` | `/api/compliance/report` | Mendapatkan laporan keamanan komprehensif. |

### Demo & Utilities

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/demo/setup` | Menginisialisasi data dummy untuk testing. |
| `GET` | `/health` | Mengecek status kesehatan server. |
| `GET` | `/metrics` | Metrik sistem server |
| `GET` | `/` | Informasi API |

#### Contoh Penggunaan (cURL)

**Setup Data Demo:**
```bash
curl -X POST http://localhost:3000/api/demo/setup
```

**Mendaftarkan Perangkat:**
```bash
curl -X POST http://localhost:3000/api/devices/register \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "DEVICE-001",
    "hostname": "WORKSTATION-01",
    "platform": "windows",
    "type": "desktop"
  }'
```

**Membuat Kebijakan Keamanan:**
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

**Memeriksa Kepatuhan:**
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

**Mendapatkan Laporan Keamanan:**
```bash
curl http://localhost:3000/api/compliance/report
```

---

## 📂 Struktur Proyek

```
unified-endpoint-management/
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
├── package.json              # Dependensi & script npm
├── README.md                 # Dokumentasi ini
└── .gitignore                # File yang diabaikan git
```

---

## 🔧 Komponen Utama

### DeviceManager
Mengelola siklus hidup perangkat:
- Registrasi perangkat
- Update status online/offline
- Tracking aktivitas
- Penyimpanan data perangkat

### SecurityManager
Mengelola aspek keamanan:
- Pembuatan dan manajemen kebijakan keamanan
- Pemeriksaan compliance otomatis
- Deteksi pelanggaran kebijakan
- Enkripsi data sensitif (AES-256-CBC)
- Generate laporan keamanan

### ClientAgent
Agent yang dijalankan di perangkat client:
- Mengumpulkan informasi sistem (OS, CPU, Memory, Disk)
- Memeriksa status keamanan lokal
- Melapor ke server secara berkala
- Dapat dikontrol (start/stop)
- Mode demo untuk simulasi

---

## 🔒 Keamanan

Proyek ini mengimplementasikan beberapa prinsip keamanan dasar:

1. **Enkripsi Data**: Menggunakan algoritma `AES-256-CBC` untuk mengenkripsi data sensitif sebelum penyimpanan atau transmisi (simulasi).
2. **Validasi Input**: Semua input API divalidasi untuk mencegah injeksi data yang tidak valid.
3. **Isolasi Proses**: Client agent berjalan sebagai proses terpisah dari server utama.

> **Catatan**: Ini adalah solusi dasar/demo. Untuk produksi, disarankan menambahkan autentikasi (JWT/OAuth), HTTPS wajib, dan database persisten (PostgreSQL/MongoDB).

---

## 🛠️ Teknologi

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Crypto** - Enkripsi data (AES-256-CBC)
- **OS module** - Informasi sistem
- **UUID** - Generate unique identifiers
- **Axios** - HTTP client untuk komunikasi

---

## 🤝 Pengembangan

Untuk menambahkan fitur baru:

1. Tambahkan modul di folder yang sesuai (`server/`, `security/`, atau `client/`)
2. Import dan gunakan di `index.js`
3. Tambahkan endpoint API jika diperlukan
4. Update dokumentasi ini

### Kontribusi

Kontribusi sangat diterima! Silakan lakukan fork repositori ini dan buat pull request untuk fitur baru atau perbaikan bug.

1. Fork proyek
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

---

## ❓ FAQ

**Q: Apakah aplikasi ini bisa digunakan untuk production?**  
A: Saat ini merupakan versi demo/prototype. Untuk production, diperlukan penambahan autentikasi, database persisten, dan HTTPS.

**Q: Bagaimana cara menambah perangkat client baru?**  
A: Gunakan endpoint `/api/devices/register` atau jalankan client agent yang akan otomatis mendaftar.

**Q: Apakah data disimpan secara permanen?**  
A: Tidak, saat ini menggunakan penyimpanan in-memory. Data akan hilang saat server restart.

---

## 📄 Lisensi

Distributed under the MIT License.

---

## 📞 Kontak & Dukungan

Jika Anda memiliki pertanyaan atau masalah, silakan buka issue di repositori GitHub ini.

**Project Link**: [https://github.com/username/unified-endpoint-management](https://github.com/username/unified-endpoint-management)
