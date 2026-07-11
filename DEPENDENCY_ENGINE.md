# Dependency Engine

## Overview
ERP akan secara cerdas memblokir interaksi yang dapat memicu `SQLite Error` atau `Foreign Key Constraint Error`. 

## Mekanisme
Jika user mencoba melakukan entri pada modal atau form tetapi data prasyarat belum ada, Dependency Engine akan mengambil alih tampilan dan mengeluarkan instruksi:
**"Master Position Belum Tersedia"** dan tombol **"Buka Setup Center"**.

## Dampak Positif
- Tidak ada raw database error yang tampil di frontend.
- UX menjadi jauh lebih terarah dan self-documenting.
