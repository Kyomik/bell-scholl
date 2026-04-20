<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version" />
  <img src="https://img.shields.io/badge/platform-Web%20App-blue" alt="Platform" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</p>

# 🔔 Bell School - Sistem Bel Sekolah Terpusat

## 📖 Deskripsi

Bell School adalah sistem bel sekolah berbasis perangkat (hardware) dan webapp sebagai antarmuka pengguna. Sistem ini dirancang untuk membantu pengelolaan jadwal alarm secara dinamis dan terpusat.

Melalui webapp yang disediakan, pengguna (guru atau admin) dapat mengelola jadwal alarm, seperti menentukan waktu, suara alarm, serta pengulangan dalam rentang mingguan.

## ✨ Fitur Utama

- Manajemen jadwal alarm (tambah, edit, hapus, hapus semua)
- Upload audio kustom (format MP3)
- Pemilihan perangkat tujuan untuk perubahan
- Sinkronisasi data antara server dan perangkat
- Tampilan responsif, dapat diakses dari berbagai perangkat

## 📚 Dokumentasi

| Panduan | Target |
|---------|--------|
| [👤 Panduan Pengguna](./guides/user-guide.md) | Guru / Admin (cara login, menambah alarm, upload audio, dll) |

## 🚀 Untuk Pengguna

1. Buka webapp Bell School melalui browser.
2. Login dengan username & password dari teknisi.
3. Klik ikon chat (kiri bawah) untuk memilih perangkat.
4. Atur jadwal alarm, pilih audio, dan simpan.

📖 Selengkapnya di [Panduan Pengguna](./guides/user-guide.md)

## 🏗️ Teknologi

| Teknologi | Kegunaan |
|-----------|----------|
| **Vite** | Build tool & development server |
| **Vanilla JS (ES6 Modules)** | Frontend murni tanpa framework |
| **WebSocket** | Komunikasi real-time dengan perangkat |
| **Mysql Db** | Penyimpanan alarm |
| **Laravel** Backend | Logic & Rest API |
| **ESP32** | Perangkat bell (hardware) |
| **SD Card** | Penyimpanan file audio MP3 |

## 👥 Maintainer

- Ilham – [@kyoomik](https://instagram.com/kyoomik)
- [Techno Kreatif Solusindo](https://www.instagram.com/technokreatifsolusindo)

## 📄 Lisensi

MIT License
