# Organization Hierarchy Design

## Concept
The Enterprise ERP utilizes a dual-reporting hierarchy anchored on the Position Engine rather than direct Employee-to-Employee relationships. This provides stability when employees transition or resign, keeping the organizational structure intact.

## Structure
1. **Structural Reporting (\`parentPositionId\`)**:
   - Represents the formal chain of command.
   - Example: \`Software Engineer\` -> \`Engineering Manager\` -> \`CTO\` -> \`CEO\`.
   - Used for structural charting, cost center rollup, and formal escalation.

2. **Functional Reporting (\`reportsToPositionId\`)**:
   - Represents day-to-day functional oversight (Matrix Organization).
   - Example: A \`Finance Business Partner\` structurally reports to \`Finance Director\`, but functionally reports to \`Engineering VP\` for a specific division.
   - Used for functional approvals and day-to-day workflows.

3. **Approval Levels (\`approvalLevel\`)**:
   - A numeric threshold designating the monetary or severity limit for approval capabilities.
   - Works in tandem with the true/false module flags (\`canApproveLeave\`, \`canApprovePurchase\`, etc.).

## Dependency & Implementation
The actual tree visualization (e.g., an Org Chart) is not implemented in this phase, but the underlying adjacency list model (using self-referencing foreign keys) allows for efficient recursive CTEs or standard graph traversals on the application side to build the tree when required.
