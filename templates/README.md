# Shared Templates & Utilities

This directory contains shared configuration files and utilities that are used across multiple projects in this repository.

## 📁 Contents

### Build & Configuration Templates

- **`vite.config.ts`** - Base Vite configuration (identical across all projects)
- **`postcss.config.js`** - PostCSS configuration (identical across all projects)
- **`tsconfig.json`** - TypeScript configuration with strict settings
- **`tsconfig.node.json`** - TypeScript config for Node/Vite config files
- **`tailwind.config.base.js`** - Base Tailwind CSS configuration (customize colors per project)
- **`package.json.base`** - Base package.json with common dependencies

### Linting & Formatting

- **`eslint.config.js`** - ESLint flat config with TypeScript and React rules
- **`.prettierrc.json`** - Prettier configuration (consistent code formatting)
- **`.prettierignore`** - Files to ignore for Prettier

### Project Setup

- **`.gitignore`** - Common gitignore patterns (node_modules, dist, env files, etc.)
- **`index.html`** - Base HTML template
- **`src/index.css`** - Base CSS with Tailwind setup and common utilities

### Editor Configuration

- **`.vscode/settings.json`** - VS Code workspace settings (format on save, ESLint integration)
- **`.vscode/extensions.json`** - Recommended VS Code extensions

### Utility Functions

- **`utils/cn.ts`** - ClassName merging utility (clsx wrapper)
- **`utils/date.ts`** - Date formatting utilities (formatDate, formatDateTime, getRelativeTime, formatDuration)
- **`utils/storage.ts`** - Base localStorage patterns (error handling, date serialization, export/import)

---

## 🚀 Usage

### Setting Up a New Project

1. **Copy build config files:**
   ```bash
   cp templates/vite.config.ts your-project/
   cp templates/postcss.config.js your-project/
   cp templates/tsconfig.json your-project/
   cp templates/tsconfig.node.json your-project/
   cp templates/tailwind.config.base.js your-project/tailwind.config.js
   ```

2. **Copy linting & formatting:**
   ```bash
   cp templates/eslint.config.js your-project/
   cp templates/.prettierrc.json your-project/
   cp templates/.prettierignore your-project/
   ```

3. **Copy project setup files:**
   ```bash
   cp templates/.gitignore your-project/
   cp templates/index.html your-project/
   mkdir -p your-project/src
   cp templates/src/index.css your-project/src/
   ```

4. **Copy editor config (optional but recommended):**
   ```bash
   cp -r templates/.vscode your-project/
   ```

5. **Customize package.json:**
   - Copy `templates/package.json.base` to `your-project/package.json`
   - Update `name` field
   - Add/remove dependencies as needed
   - Remove `@tanstack/react-query` if not using React Query

6. **Copy utilities (if needed):**
   ```bash
   mkdir -p your-project/src/lib
   cp templates/utils/cn.ts your-project/src/lib/utils.ts
   # Add date utilities from templates/utils/date.ts
   # Reference storage patterns from templates/utils/storage.ts
   ```

7. **Customize per project:**
   - **HTML:** Update `<title>` in `index.html`
   - **Tailwind:** Update primary colors in `tailwind.config.js`
   - **CSS:** Customize `--color-primary` variable in `src/index.css`
   - **Utilities:** Add project-specific utilities alongside shared ones
   - **Storage:** Extend base patterns with your data types

---

## 📝 Customization Guide

### Tailwind Config

All projects use the same base structure but customize colors:

```javascript
// In your project's tailwind.config.js
colors: {
  primary: {
    // Customize these for your project's theme
    50: '#f0f9ff',   // Lightest
    500: '#0ea5e9',  // Base
    900: '#0c4a6e',  // Darkest
  },
}
```

### Date Utilities

The date utilities are standardized across projects. If you need project-specific formatting, extend them:

```typescript
// In your project
import { formatDate, getRelativeTime } from './lib/utils';

// Add project-specific formatting
export function formatDateShort(date: Date): string {
  // Your custom logic
}
```

### Storage Utilities

Each project has different data structures, so extend the base patterns:

```typescript
// In your project's storage.ts
import { safeParseJSON, safeSaveToStorage, restoreDates } from './base-storage';

const STORAGE_KEY = 'your-project-data';

export function loadData(): YourAppData {
  const stored = localStorage.getItem(STORAGE_KEY);
  const raw = safeParseJSON(stored, getDefaultData());
  return restoreDates(raw, ['createdAt', 'updatedAt']); // Specify date fields
}
```

### Linting & Formatting

The ESLint config uses the **flat config format** (ESLint 9+) with:
- TypeScript strict rules
- React Hooks rules
- React Refresh rules
- Unused variables detection (with `_` prefix ignore pattern)

The Prettier config enforces:
- No semicolons
- Single quotes
- 2-space indentation
- 100 character line width
- Trailing commas (ES5 style)

**Available scripts:**
```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting errors
npm run format        # Format code with Prettier
npm run format:check  # Check formatting without changing files
```

---

## 🔄 Updating Templates

When updating shared templates:

1. **Update the template file** in this directory
2. **Update existing projects** by comparing and merging changes
3. **Document breaking changes** in this README if needed

---

## ✅ Benefits

- **Consistency:** Same tooling and versions across projects
- **Faster setup:** Copy templates instead of recreating configs
- **Easier maintenance:** Update once, propagate to projects
- **Shared knowledge:** Clear patterns for future projects

---

## 📚 Project-Specific Notes

### LiveJournal Clone
- Uses Tiptap editor (add `@tiptap/*` packages)
- No React Query (remove from dependencies)
- Custom HTML utilities (`stripHtml`, `hasTextContent`)

### JIRA Wrapper
- Uses React Query for API calls
- Custom JIRA validation utilities
- Separate cache management

### Last.fm Clone
- Uses React Query for API calls
- Custom duration formatting (included in templates now)
- Custom grouping utilities

---

**Note:** These templates are starting points. Each project should be customized to fit its specific needs while maintaining consistency in shared patterns.

