# Dependency & Validation Engine

## Rules Enforced
1. **Vertical Integrity**: Child tiers must link to existing parent tiers (e.g. `section.department_id` must be valid).
2. **Hierarchy Validation**: Position parent relationships (`parent_position_id`) cannot contain circular references.
3. **Master Data Completion**: Ensures mandatory master tiers are present.
