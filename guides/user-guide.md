# HANDBOOK PROJECT BELL SCHOOL

**Edisi: 1.0**  
**Target Pembaca: Guru / Admin (Pengguna Akhir)**

---

## 1. Pendahuluan

Project ini merupakan sistem bell sekolah berbasis perangkat (hardware) dan webapp sebagai antarmuka pengguna (UI). Sistem ini dirancang untuk membantu pengelolaan jadwal alarm secara dinamis dan terpusat.

Melalui webapp yang disediakan, pengguna—khususnya guru atau admin—dapat mengelola jadwal alarm, seperti menentukan waktu, suara alarm, serta pengulangan (repeat) dalam rentang mingguan.

Project ini bertujuan untuk meningkatkan efisiensi dalam pengaturan jadwal bell sekolah serta memastikan distribusi alarm dapat berjalan secara terpusat dan terkontrol.

---

## 2. Web App

### 2.1. Preview

Webapp Bell School menyediakan berbagai fitur untuk mendukung penjadwalan alarm yang perlu ditetapkan. Webapp ini juga bersifat responsif, sehingga tampilan antarmuka dapat menyesuaikan perangkat yang digunakan oleh pengguna.

Selain itu, webapp dilengkapi:
- Fitur pemilihan perangkat yang dituju
- Fitur sinkronisasi data antara server dan perangkat

### 2.2. Gambaran Umum

Webapp ini membantu Anda:

- Memanajemen jadwal alarm
- Menyimpan audio dari webapp
- Memilih perangkat yang ingin diterapkan perubahan
- Sinkronisasi data di server dengan perangkat

---

## 3. Login

- Masukkan **Username** dan **Password** yang telah didaftarkan oleh teknisi.
- Klik tombol **Login**.
- Jika berhasil, Anda akan masuk ke halaman Dashboard.

---

## 4. Antarmuka Utama

Setelah login, Anda akan melihat:

### 4.1. Icon Chat (Kiri Bawah)

- Daftar perangkat (**OFFLINE** / **ONLINE**) akan tampil ketika diklik.
- Icon ini bisa digerakkan (berputar).
- Ketika cursor berada di atas perangkat, nama perangkat akan tampil.

### 4.2. Card Utama

| Bagian | Fungsi |
|--------|--------|
| **Header** | Tombol Burger untuk membuka Card Sekunder |
| **Waktu** | Atur jam dan menit (format 24 jam) menggunakan tombol atas/bawah. Default: 07:30 |
| **Hari** | Kumpulan tombol untuk memilih hari aktif alarm (default semua aktif) |
| **Audio** | Daftar audio yang tersedia + tombol unggah audio baru |
| **Footer** | Tombol **Simpan** dan **Reset** |

### 4.3. Card Sekunder

| Bagian | Fungsi |
|--------|--------|
| **Header** | Tombol Pengaturan untuk kembali ke Card Utama |
| **Area tengah** | Daftar alarm yang tersimpan (waktu, hari, tombol hapus) |
| **Footer** | Tombol **Sync** (sinkronisasi) dan **Hapus Semua** |

---

## 5. Fitur Utama

### 5.1. Menambah Alarm Baru

1. Klik **Icon Chat** (kiri bawah).
2. Gulir ke kanan/kiri, pilih perangkat yang dituju.
3. Pada **Card Utama**, pilih hari-hari untuk alarm.
4. Tentukan jam dan menit menggunakan tombol atas/bawah.
5. Pilih salah satu audio pada bagian **Audio**.
6. Klik tombol **Simpan**.
   - Perubahan akan dikirim ke perangkat dan disimpan di server.

### 5.2. Mengupload Audio Baru

- Pada **Card Utama**, klik **Unggah Audio Kustom**.
- Akan terbuka tampilan folder pengguna.
- Pilih file audio (format **MP3**).
- Klik tombol **Kirim** yang muncul setelah audio dipilih.
- Proses upload akan berjalan, tunggu notifikasi selesai.

### 5.3. Mereset Inputan

- Pada **Card Utama**, klik tombol **Reset**.
- Semua inputan (hari, waktu, audio) akan kembali ke nilai default.

### 5.4. Menghapus Alarm

1. Pada **Card Utama**, klik **Tombol Burger** (pojok kanan atas).
2. Di **Card Sekunder**, klik tombol **🗑️ (tempat sampah)** pada alarm yang ingin dihapus.
3. Perubahan akan dikirim ke perangkat dan disimpan di server.

### 5.5. Menghapus Semua Alarm

1. Pada **Card Utama**, klik **Tombol Burger**.
2. Di **Card Sekunder**, klik tombol **Hapus Semua**.
3. Konfirmasi penghapusan.
4. Perubahan akan dikirim ke perangkat dan disimpan di server.

### 5.6. Sinkronisasi Data

1. Pada **Card Utama**, klik **Tombol Burger**.
2. Di **Card Sekunder**, klik tombol **Sync**.
3. Data pada perangkat akan disinkronkan dengan data yang ada di server.

> 💡 **Catatan:**
> - Alarm dengan waktu dan hari yang sama **tidak diperbolehkan**. Webapp akan memberi peringatan.
> - Daftar audio akan muncul hanya jika SD card terbaca dan memiliki file audio.
> - Setiap data (audio, waktu, hari) harus di-set saat membuat alarm baru. Jika tidak, webapp akan memberi peringatan.
> - Sinkronisasi dan Hapus Semua tidak diperbolehkan jika belum ada data.

---

## 6. Perangkat (Hardware)

Perangkat Bell berfungsi sebagai media untuk memutar alarm berdasarkan jadwal yang telah ditentukan melalui webapp. Data jadwal disimpan di memori perangkat.

Perangkat dilengkapi dengan **SD Card** untuk menyimpan file audio (format MP3). Sistem pada perangkat akan terus melakukan pengecekan waktu secara berkala dan membandingkannya dengan jadwal alarm yang tersimpan. Ketika waktu sesuai, perangkat akan memutar audio melalui speaker.

---

## 7. Hal yang Perlu Diperhatikan Pengguna

### A. Persiapan SD Card (untuk menyimpan nada bel)

- Perangkat bell menggunakan kartu SD untuk menyimpan file suara (format **MP3**).
- Pastikan SD card diformat **FAT32**.
- Letakkan file MP3 di **folder utama (root)** SD card, **bukan di dalam folder**.
- Nama file sebaiknya **tanpa spasi**, misal `bel_masuk.mp3`.

### B. Jika Alarm Tidak Berbunyi

1. Buka webapp Bell School.
2. Klik ikon chat (kiri bawah) → lihat apakah perangkat Anda berstatus **ONLINE**.
3. Jika **OFFLINE**, perangkat tidak bisa memutar alarm. Cek kabel power dan WiFi.
4. Jika ONLINE tapi alarm tetap tidak berbunyi, coba upload ulang file audio (pastikan format MP3) atau hubungi teknisi.

### C. Mengupload Audio Baru

- Hanya file **MP3** yang didukung.
- Proses upload membutuhkan waktu beberapa detik, **jangan tutup webapp** sampai muncul notifikasi selesai.

---

## 8. Troubleshooting Sederhana

| Masalah | Solusi |
|---------|--------|
| Tidak bisa login | Pastikan username dan password benar. Hubungi teknisi jika lupa. |
| Perangkat OFFLINE | Cek kabel power dan koneksi WiFi perangkat bell. Restart perangkat. |
| Alarm tidak berbunyi padahal ONLINE | Cek apakah file audio ada di SD card dan format MP3. Upload ulang audio. |
| Upload audio gagal | Pastikan file berformat MP3 dan ukuran tidak terlalu besar. Coba lagi. |
| Daftar audio kosong | SD card tidak terbaca atau tidak berisi file MP3. Periksa SD card. |

---

**Dokumen ini untuk pengguna akhir. Untuk panduan teknis (jika tersedia), hubungi tim teknisi.**
