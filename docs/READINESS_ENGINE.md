# Readiness Engine

## Overview
Engine ini mengevaluasi status kesiapan (readiness) dari seluruh modul ERP. Kalkulasi dilakukan secara penuh oleh backend.

## API Endpoint
`GET /api/bootstrap/status`

Mengembalikan skor persentase progress dan status boolean `ready` per modul, disertai data statistik (seperti `hasCompany`, `employees`, dll.).

## Module Coverage
- Organization
- Human Resource
- Reference
- RBAC
- CRM
- Asset
- Finance
- Helpdesk
- Notification
- Integration
