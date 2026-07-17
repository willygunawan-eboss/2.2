# Event Engine & Event Bus

## Event Bus
- Implements an internal Publish/Subscribe pattern.
- Separates domains from each other (e.g., Employee Domain publishes `EMPLOYEE_PROMOTION_APPROVED`, Payroll Domain subscribes to it).

## Event Traceability
All events require a `Trace ID` and `Source Module` for full observability.