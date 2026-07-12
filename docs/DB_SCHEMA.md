# DB Schema
- employees table no longer contains user_id.
- Employee is mapped to User via email address to decouple auth context from HR context.
