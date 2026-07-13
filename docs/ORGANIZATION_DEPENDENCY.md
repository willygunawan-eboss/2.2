# Organizational Dependency Matrix

## Strict Hierarchy
- `Company` (Root)
- `Branch` -> belongs to `Company`
- `Division` -> belongs to `Branch`
- `Department` -> belongs to `Division`
- `Section` -> belongs to `Department`
- `Team` -> belongs to `Section`

## Auxiliary Structure
- `Job Grade` -> Independent metadata
- `Position` -> belongs to `Department`, maps to `Job Grade`, and can have a `Parent Position` (Hierarchy)
