# Tech Stack Unification Opportunities

Analysis of common patterns across LiveJournal Clone, JIRA Wrapper, and Last.fm Clone that could be unified for easier development.

---

## 🎯 Summary

While each project remains independent, there are several shared configurations, utilities, and patterns that could be standardized to improve:
- **Developer experience** (copy-paste setup, consistent tooling)
- **Maintenance** (single source of truth for common configs)
- **Code reuse** (shared utilities without coupling projects)

---

## 📋 Identical Configurations

These files are **100% identical** across all three projects:

### ✅ `vite.config.ts`
```typescript
// Exact same in all 3 projects
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**Recommendation:** Create a shared template/config file in repo root.

### ✅ `postcss.config.js`
```javascript
// Exact same in all 3 projects
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Recommendation:** Template in repo root.

---

## 📋 Nearly Identical Configurations

### 🔧 `tsconfig.json`

**Status:** Functionally identical, minor formatting differences

- **JIRA Wrapper:** More compact, no comments
- **Last.fm & LiveJournal:** Includes comments, same settings

**Key settings (all three):**
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- Same module resolution, target, libs

**Recommendation:** Standardize format and create base template.

---

### 📦 `package.json`

**Dependencies (nearly identical):**

| Package | JIRA | Last.fm | LiveJournal | Action |
|---------|------|---------|-------------|--------|
| `react` | ✅ 18.2.0 | ✅ 18.2.0 | ✅ 18.2.0 | ✅ Aligned |
| `react-dom` | ✅ 18.2.0 | ✅ 18.2.0 | ✅ 18.2.0 | ✅ Aligned |
| `@tanstack/react-query` | ✅ 5.17.0 | ✅ 5.17.0 | ❌ Missing | ⚠️ **Add to LiveJournal?** |
| `date-fns` | ✅ 2.30.0 | ✅ 2.30.0 | ✅ 2.30.0 | ✅ Aligned |
| `lucide-react` | ✅ 0.294.0 | ✅ 0.294.0 | ✅ 0.294.0 | ✅ Aligned |
| `clsx` | ✅ 2.0.0 | ✅ 2.0.0 | ✅ 2.0.0 | ✅ Aligned |
| `@tiptap/*` | ❌ | ❌ | ✅ 2.1.13 | ✅ Project-specific |

**DevDependencies:** All identical versions.

**Recommendation:** 
1. Create base `package.json.template` with common deps
2. Consider standardizing React Query usage (see below)

---

### 🎨 `tailwind.config.js`

**Status:** Very similar structure, minor differences

**Common structure:**
- Same content paths
- Primary color scale (different colors)
- Same theme extend pattern

**Differences:**
- **Last.fm:** Has `darkMode: 'class'` + custom transition utilities
- **JIRA & LiveJournal:** No explicit darkMode (likely auto)
- **Primary colors:** Different hues (blue vs green)

**Recommendation:** 
1. Create base config template with common structure
2. Allow project-specific color overrides
3. Standardize dark mode approach (class-based is more explicit)

---

## 🔧 Shared Utility Patterns

### 📁 `src/lib/utils.ts`

**Common across all projects:**
- ✅ `cn()` function using `clsx` (identical implementation)
- ✅ Date formatting utilities (similar patterns, minor variations)

**Functions comparison:**

| Function | JIRA | Last.fm | LiveJournal | Can Unify? |
|----------|------|---------|-------------|------------|
| `cn()` | ✅ | ✅ | ✅ | ✅ **Identical** |
| `formatDate()` | ✅ | ❌ | ✅ | ✅ **Same logic** |
| `formatDateTime()` | ✅ | ❌ | ✅ | ✅ **Same logic** |
| `getRelativeTime()` / `formatRelativeTime()` | ✅ | ✅ (diff name) | ✅ | ✅ **Same logic, diff names** |
| `formatDuration()` | ❌ | ✅ | ❌ | Project-specific |
| `groupByDate()` | ❌ | ✅ | ❌ | Project-specific |
| `stripHtml()` / `hasTextContent()` | ❌ | ❌ | ✅ | Project-specific |
| `validateJiraUrl()` / `validateJQL()` | ✅ | ❌ | ❌ | Project-specific |

**Recommendation:** 
1. Extract common utilities (`cn`, date formatting) to shared location
2. Standardize function names (`getRelativeTime` vs `formatRelativeTime`)
3. Keep project-specific utilities separate

---

### 💾 `src/lib/storage.ts`

**Common patterns (similar structure, different data):**
- ✅ `loadData()` - Loads from localStorage with error handling
- ✅ `saveData()` - Saves to localStorage with quota error handling
- ✅ Date deserialization pattern (convert strings to Date objects)
- ✅ `exportData()` / `importData()` (JIRA & LiveJournal only)

**Differences:**
- Different data structures (`AppData` types)
- Different storage keys
- Different default values
- JIRA has encryption for tokens
- JIRA has separate cache management

**Recommendation:**
1. Create shared base storage utility with common patterns:
   - Error handling
   - Quota exceeded handling
   - Date serialization/deserialization helpers
   - Export/import utilities
2. Projects extend with their specific types and logic

---

## 🎨 CSS & Styling

### `src/index.css`

**Common:**
- ✅ Base Tailwind imports (identical)
- ✅ Theme transition utilities (similar patterns)

**Differences:**
- **Last.fm:** Minimal, dark mode classes
- **JIRA & LiveJournal:** More elaborate theme transition setup, CSS variables

**Recommendation:**
1. Extract common base styles (Tailwind imports, basic theme transitions)
2. Allow project-specific extensions

---

## 🔄 Data Fetching Pattern

**Current state:**
- **JIRA & Last.fm:** Use React Query v5
- **LiveJournal:** Uses plain hooks only

**Consideration:** Should LiveJournal adopt React Query for consistency?

**Pros:**
- ✅ Consistent data fetching patterns across projects
- ✅ Built-in caching, retry logic
- ✅ Better dev experience for API calls

**Cons:**
- ❌ LiveJournal mostly uses localStorage (no real API fetching needs)
- ❌ Adds dependency for minimal benefit

**Recommendation:** **Keep as-is** - LiveJournal's simple hook pattern fits its use case (Spotify API is minimal).

---

## 📝 Recommendations Summary

### 🔴 High Priority (Easy wins, high impact)

1. **Create shared config templates** in repo root:
   - `templates/vite.config.ts`
   - `templates/postcss.config.js`
   - `templates/tsconfig.json`
   - `templates/package.json.base`
   - `templates/tailwind.config.base.js`

2. **Standardize `cn()` utility** - It's already identical, just ensure all projects import it the same way

3. **Unify date formatting utilities** - Extract common `formatDate`, `formatDateTime`, `getRelativeTime` to shared location or template

### 🟡 Medium Priority (Good for maintenance)

4. **Create shared storage utility base** - Extract common patterns (error handling, date serialization) while keeping project-specific logic separate

5. **Standardize Tailwind base config** - Template with common structure, allow color overrides

6. **Standardize CSS base styles** - Extract common Tailwind + theme transition patterns

### 🟢 Low Priority (Nice to have)

7. **Standardize dark mode approach** - Consider making all projects use `darkMode: 'class'` explicitly

8. **Consider React Query for LiveJournal** - Only if it starts doing more API calls

---

## 🏗️ Proposed Structure

```
specs_and_prds/
├── templates/
│   ├── vite.config.ts           # Shared Vite config
│   ├── postcss.config.js        # Shared PostCSS config
│   ├── tsconfig.json            # Shared TypeScript config
│   ├── tailwind.config.base.js  # Base Tailwind config
│   ├── package.json.base        # Base package.json (common deps)
│   └── utils/
│       ├── cn.ts                # Shared cn() utility
│       ├── date.ts              # Shared date formatting utilities
│       └── storage.ts           # Base storage patterns
│
├── jira-wrapper/
├── lastfm-clone/
└── livejournal-clone/
```

**Usage:** When creating new projects, copy templates and customize as needed.

---

## ✅ What NOT to Unify

- **Project-specific utilities** (JIRA validation, Spotify helpers, Tiptap HTML helpers)
- **Data structures/types** - Each project has its own domain
- **Component libraries** - Keep projects independent
- **API integrations** - Project-specific

---

## 🎯 Benefits

1. **Faster project setup** - Copy templates instead of recreating configs
2. **Consistent tooling** - Same versions, same configs across projects
3. **Easier maintenance** - Update templates once, propagate to projects
4. **Better DX** - Less copy-paste, fewer inconsistencies
5. **Knowledge sharing** - Clear patterns for future projects

---

**Note:** This is about **ease of development**, not merging the projects. Each project remains independent, but benefits from shared configuration and utility patterns.

