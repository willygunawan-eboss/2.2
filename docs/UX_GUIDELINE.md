# Enterprise UX Guideline

This document defines the strict UI/UX standards to be maintained throughout the ERP implementation.

## Layout & Structure
- **Global Backgrounds**: Use `bg-slate-50` for primary application backgrounds to provide a soft, professional canvas.
- **Card Elements**: Use `bg-white`, `border-slate-200`, and `shadow-sm`.
- **Primary Navigation**: Ensure active states are visually distinct (e.g. `text-blue-700`, `bg-blue-50`).

## Colors & Typography
- **Primary Brand**: Blue (`blue-600` for primary buttons, `blue-50` for light accents).
- **Success / Ready**: Emerald (`emerald-600`, `emerald-50`).
- **Warning / Incomplete**: Amber (`amber-600`, `amber-50`).
- **Error / Danger**: Rose (`rose-600`, `rose-50`).
- **Typography**: Adhere to standard sans-serif system fonts. Ensure sufficient padding/margins between text blocks to reduce cognitive load.

## Data Presentation
- **Master Data Layouts**: Uniformly include Search, Pagination, Audit Trail, and Quick Actions (e.g., Export/Import).
- **Empty States**: Must be communicative. Use subtle icons (e.g. `opacity-20`) and clear action-oriented messaging.
- **Loading States**: Utilize consistent spinners or skeleton loaders rather than blocking the entire viewport.

## Components
- **Buttons**:
  - Primary: `bg-blue-600 hover:bg-blue-700 text-white`.
  - Secondary/Ghost: `bg-white border border-slate-200 text-slate-700 hover:bg-slate-50`.
- **Forms**: Group fields logically with subtle headings (e.g. `text-xs uppercase tracking-wider text-slate-400`).

Adherence to these guidelines ensures a cohesive, Enterprise-grade experience that does not confuse users transitioning between modules.
