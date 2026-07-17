# Business Process Engine

## Overview
The Enterprise Business Process Engine is the Core Platform for all business module workflows, transitions, approvals, and lifecycle management within the ICHANGEBOSS ERP V2. 

## Principles
1. **Generic Core**: The engine handles generic transitions and states. It has zero knowledge of specific business entities (e.g., Employee, Customer, Vendor).
2. **Configuration Driven**: Entities define their process via JSON configuration in `Process Definitions`.
3. **Event-Driven**: All inter-module communication is done via the Internal Event Bus.