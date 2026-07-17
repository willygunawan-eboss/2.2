# Architecture Decision Record (ADR)

## Why a Generic Engine?
To prevent duplicate state management, activity logging, and approval logic across 15+ ERP modules.

## Why Separate Business Rules from Runtime?
The Runtime only cares that State A can go to State B if User has Role X. The Business logic (e.g., Employee Salary must be > 0 before promotion) is validated by the Employee Domain *before* calling the Runtime.

## Why Event-Driven?
To prevent tight coupling. The Human Capital module should not directly call the Finance module. It publishes an event, and Finance reacts.