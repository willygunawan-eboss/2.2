const fs = require('fs');

const docs = {
  'docs/BUSINESS_PROCESS_ENGINE.md': `
# Business Process Engine

## Overview
The Enterprise Business Process Engine is the Core Platform for all business module workflows, transitions, approvals, and lifecycle management within the ICHANGEBOSS ERP V2. 

## Principles
1. **Generic Core**: The engine handles generic transitions and states. It has zero knowledge of specific business entities (e.g., Employee, Customer, Vendor).
2. **Configuration Driven**: Entities define their process via JSON configuration in \`Process Definitions\`.
3. **Event-Driven**: All inter-module communication is done via the Internal Event Bus.
  `,
  'docs/PROCESS_DEFINITION.md': `
# Process Definition

Defines the template of a business process (e.g., \`EMPLOYEE_PROMOTION\`).

- **statesConfigJson**: JSON defining valid states (\`INITIAL\`, \`NORMAL\`, \`FINAL\`).
- **transitionsConfigJson**: JSON defining valid transitions (\`DRAFT_TO_SUBMITTED\`) and their rules (Roles allowed, Approval levels).
  `,
  'docs/PROCESS_INSTANCE.md': `
# Process Instance

A running instance of a Process Definition.
- Ties a \`ProcessDefinition\` to an \`EntityID\` and \`EntityType\`.
- Tracks \`CurrentState\` and overall \`Status\` (RUNNING, COMPLETED, CANCELLED, FAILED).
  `,
  'docs/STATE_MACHINE.md': `
# State Machine

- Powered by the Process Definition configurations.
- Enforces strict transition pathways. Arbitrary state jumps are rejected.
- State values are dynamic and configurable (not hardcoded).
  `,
  'docs/TRANSITION_ENGINE.md': `
# Transition Engine

Handles the logic of moving a Process Instance from one State to another.
- Validates current state.
- Validates transition existence.
- Evaluates role and approval requirements.
- Fires \`STATE_CHANGED\` events.
  `,
  'docs/EVENT_ENGINE.md': `
# Event Engine & Event Bus

## Event Bus
- Implements an internal Publish/Subscribe pattern.
- Separates domains from each other (e.g., Employee Domain publishes \`EMPLOYEE_PROMOTION_APPROVED\`, Payroll Domain subscribes to it).

## Event Traceability
All events require a \`Trace ID\` and \`Source Module\` for full observability.
  `,
  'docs/EVENT_BUS.md': `
# Event Bus (Same as Event Engine doc)
Centralized communication layer. Future-proofed to be replaced by Kafka/RabbitMQ if required.
  `,
  'docs/TIMELINE_ENGINE.md': `
# Timeline Engine

Aggregates activities and state transitions chronologically to provide a unified history view for any Business Entity.
  `,
  'docs/ACTIVITY_ENGINE.md': `
# Activity Engine

Generates standard audit trails for all actions taken by users or systems within a Process Instance. Tracks:
- Who, What, When, Where, Result.
  `,
  'docs/AUDIT_ENGINE.md': `
# Audit Engine

Immutable record store for compliance. Reuses Activity definitions but focuses on unauthorized access attempts, systemic failures, and administrative overrides.
  `,
  'docs/TRACE_ENGINE.md': `
# Trace Engine

Injects a \`TraceContext\` (Trace ID, Correlation ID) into all Runtime executions. Essential for debugging distributed event chains.
  `,
  'docs/METRIC_ENGINE.md': `
# Metric Engine

(To be implemented via future Dashboard) 
Will consume Process Instance and Activity data to generate KPIs (e.g., Average Time in State, Approval Bottlenecks).
  `,
  'docs/ENGINE_GOVERNANCE.md': `
# Engine Governance

1. **No Custom Engines**: All modules MUST use this single Business Process Engine.
2. **Backward Compatibility**: Any addition to the engine must not break existing Process Definitions.
3. **No Direct UI Coupling**: The engine operates purely in the domain/service layer.
  `,
  'docs/ARCHITECTURE_DECISION_RECORD.md': `
# Architecture Decision Record (ADR)

## Why a Generic Engine?
To prevent duplicate state management, activity logging, and approval logic across 15+ ERP modules.

## Why Separate Business Rules from Runtime?
The Runtime only cares that State A can go to State B if User has Role X. The Business logic (e.g., Employee Salary must be > 0 before promotion) is validated by the Employee Domain *before* calling the Runtime.

## Why Event-Driven?
To prevent tight coupling. The Human Capital module should not directly call the Finance module. It publishes an event, and Finance reacts.
  `
};

for (const [filepath, content] of Object.entries(docs)) {
  fs.writeFileSync(filepath, content.trim());
}

console.log('Engine docs generated.');
