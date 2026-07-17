# Enterprise Workspace Framework

## Overview
The Enterprise Workspace Framework is a UI library built on top of React and Tailwind CSS. It provides a standardized, composable set of layouts and components to build "Workspaces" for various Business Entities (e.g., Employees, Customers, Vendors) consistently.

## Core Concepts
- **Composition over Inheritance**: Workspaces are built by composing small, generic components.
- **Business Agnostic**: Framework components do not know about `Employee` or `Customer` types. They accept generic data props.
- **Master-Detail Default**: Native support for explorer (left sidebar) and detailed view (right main content).