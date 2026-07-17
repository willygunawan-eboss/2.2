const fs = require('fs');

const docs = {
  'docs/WORKSPACE_FRAMEWORK.md': `
# Enterprise Workspace Framework

## Overview
The Enterprise Workspace Framework is a UI library built on top of React and Tailwind CSS. It provides a standardized, composable set of layouts and components to build "Workspaces" for various Business Entities (e.g., Employees, Customers, Vendors) consistently.

## Core Concepts
- **Composition over Inheritance**: Workspaces are built by composing small, generic components.
- **Business Agnostic**: Framework components do not know about \`Employee\` or \`Customer\` types. They accept generic data props.
- **Master-Detail Default**: Native support for explorer (left sidebar) and detailed view (right main content).
  `,
  
  'docs/WORKSPACE_COMPONENT_LIBRARY.md': `
# Workspace Component Library

## Structure
- \`WorkspaceContainer\`: Root layout.
- \`WorkspaceMain\`: Main content wrapper.
- \`WorkspaceSidebar\`: Explorer/navigation wrapper.
- \`WorkspaceHeader\`: Consistent header for titles, badges, and quick actions.
- \`WorkspaceTabs\`: Standardized tab navigation.
- \`WorkspaceCard\`: White-boxed content sections.
- \`WorkspaceEmptyState\`: Standard placeholder for empty lists or unselected states.
- \`WorkspaceAvatar\`: Consistent avatar component.
  `,

  'docs/DESIGN_SYSTEM.md': `
# Enterprise Design System

## Principles
1. **Consistency**: Same padding, margins, and colors across all modules.
2. **Reusability**: Use existing tokens and components.
3. **Accessibility**: Maintain high contrast and keyboard navigability.

We rely on standard Tailwind CSS classes as our design tokens to ensure a robust and globally adopted system.
  `,

  'docs/DESIGN_TOKEN.md': `
# Design Tokens

We leverage Tailwind's configuration as our source of truth for Design Tokens.

## Spacing
- xs: \`p-2\` / \`m-2\`
- sm: \`p-4\` / \`m-4\`
- md: \`p-6\` / \`m-6\`
- lg: \`p-8\` / \`m-8\`

## Colors
- Primary: \`blue-600\`
- Surface: \`white\`
- Background: \`slate-50\`
- Border: \`slate-200\`
  `,

  'docs/THEME_ENGINE.md': `
# Theme Engine

Currently, themes are managed via Tailwind CSS configuration and utility classes. 
We support:
- Light Theme (default).
- Dynamic theming can be added by expanding Tailwind's color palette (e.g., using CSS variables if custom branding is needed in the future).
  `,

  'docs/WORKSPACE_GOVERNANCE.md': `
# Workspace Governance

1. **Use the Framework**: No custom CRUD forms or isolated detailed views. All entities MUST use the Workspace Framework.
2. **Generic Components Only**: Do not add business logic to \`src/components/workspace\`.
3. **Approval**: Any new core workspace component requires approval from the Chief Software Architect.
  `,

  'docs/UI_ARCHITECTURE.md': `
# UI Architecture

- **Atomic Design principles**: Starting from basic elements (buttons, inputs) to templates (workspaces).
- **Service Layer Data**: The UI strictly renders data provided by the service layer API (e.g., aggregated \`/workspace\` endpoints).
- **Responsive Framework**: Components dynamically scale from mobile (stacked) to desktop (master-detail).
  `,

  'docs/COMPONENT_GUIDELINE.md': `
# Component Guidelines

- **Prop Types**: Strongly typed with TypeScript.
- **Tailwind Merge**: Use \`cn()\` (clsx + tailwind-merge) to allow custom class overriding seamlessly.
- **Single Responsibility**: Each component should do one thing well.
  `,

  'docs/HOOK_GUIDELINE.md': `
# Hook Guidelines

- Use generic hooks for state (e.g., \`useWorkspaceTabs\`).
- Avoid direct DB/API calls inside UI hooks. Move them to service hooks (e.g., \`useEmployeeWorkspace\`).
- Prefer \`useMemo\` for expensive client-side filtering (e.g., debounced search filtering).
  `,

  'docs/CONTRIBUTING_UI.md': `
# Contributing to the UI Framework

1. **Check Existing Components**: Do not duplicate.
2. **Keep it Generic**: If you find yourself passing \`employeeId\`, it doesn't belong in the core framework.
3. **Follow the Design System**: Use the standard Tailwind spacing and color scales.
4. **Document**: Update the Component Library doc when adding new components.
  `
};

for (const [filepath, content] of Object.entries(docs)) {
  fs.writeFileSync(filepath, content.trim());
}

console.log('Docs generated.');
