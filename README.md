# CAPS-24: WebGIS Based Identification and Mapping of Medicinal Plants 🌿🗺️

Sistem Informasi Geografis Berbasis Web (WebGIS) interaktif untuk identifikasi, pemantauan, dan pemetaan persebaran tanaman obat (Medicinal Plants). Proyek ini dikembangkan sebagai bagian dari tugas *Capstone* (CAPS-24) oleh mahasiswa Ilmu Komputer, IPB University.

---

## 👥 Tim Pengembang (CAPS-24)

Proyek ini dibangun dan dikembangkan oleh:

* **Berton Adiwidya Wibowo** (G6401231043)
* **Marsya Hasna Khairunnisa** (G6401231015)
* **Marstella Nataline Purba Siboro** (G6401231101)
* **Naufal Akmal Rizqulloh** (G6401231065)

---

## ✨ Fitur Utama

* **Map Explorer Interaktif:** Pemetaan titik koordinat spesimen tanaman obat menggunakan peta spasial dinamis dengan dukungan berbagai lapisan dasar (*Layer Switcher*).
* **Filter Geospasial:** Pencarian dan penyaringan data tanaman berdasarkan kategori (Herbal, Aromatik, Hias, dll.) dan area lokasi.
* **Data Portal Terpusat:** Katalog digital yang memuat detail informasi tanaman, termasuk nama ilmiah, skala penemuan, dan dokumentasi visual.
* **Admin Dashboard:** Sistem manajemen konten (CMS) dengan autentikasi aman untuk mengelola (CRUD) data spasial tanaman obat langsung ke dalam basis data.

---

## 🛠️ Teknologi yang Digunakan

Sistem ini dibangun menggunakan arsitektur modern (*Client-Server*) dengan pemisahan antara *Frontend* dan *Backend*:

### Frontend (User Interface & WebGIS)
* **React.js** (dengan Vite)
* **TypeScript**
* **Tailwind CSS** (Styling & Responsive Design)
* **React Leaflet** (Render Peta & Spasial)
* **Zod & React Hook Form** (Validasi Form)

### Backend & Database (API & Spasial Data)
* **FastAPI** (Python Web Framework)
* **PostgreSQL** (Relational Database)
* **PostGIS** (Ekstensi Geospasial untuk PostgreSQL)

---

## 🚀 Panduan Instalasi Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek secara lokal di mesin Anda.

### 1. Kloning Repositori
Buka terminal dan jalankan perintah berikut:
```bash
git clone [https://github.com/naufalarizq/webgis-medical-plants.git](https://github.com/naufalarizq/webgis-medical-plants.git)
cd webgis-medical-plants