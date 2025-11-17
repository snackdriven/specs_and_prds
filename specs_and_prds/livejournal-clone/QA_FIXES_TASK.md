# QA Fixes Implementation Task

**Date:** 2025-01-22  
**Agent:** tester  
**Priority:** High - Security and Performance Fixes

---

## Task Overview

Implement all fixes identified in `QA_CODE_REVIEW_2025.md` for the LiveJournal clone. All fixes must maintain design decision compliance (single-user, keyboard navigation, no touch/screen reader, desktop-only).

---

## Critical Design Constraints

**MUST RESPECT:**
- ✅ Single user, no sharing, local-first
- ✅ Keyboard navigation (Tab, Enter, Space, Arrow keys, Escape)
- ✅ Smooth animations (200-300ms transitions)
- ❌ NO screen reader support (no ARIA, no roles)
- ❌ NO touch support (no mobile, no touch handlers)
- ❌ NO mobile optimizations (desktop-only)

---

## Fixes to Implement

### 🔴 High Priority Fixes

#### Fix 1: XSS Protection in EntryDetail.tsx
**File:** `src/components/journal/EntryDetail.tsx:77`
**Current:** Uses `dangerouslySetInnerHTML` without sanitization
**Fix:** Add DOMPurify sanitization or use Tiptap's `generateHTML`

**Implementation:**
1. Install `dompurify` and `@types/dompurify`:
   ```bash
   npm install dompurify
   npm install --save-dev @types/dompurify
   ```
2. Import and use DOMPurify:
   ```typescript
   import DOMPurify from 'dompurify';
   
   // In render:
   dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.content) }}
   ```
3. Ensure keyboard navigation still works (no changes needed)

#### Fix 2: Replace window.prompt with In-App Modal
**File:** `src/components/journal/RichTextEditor.tsx:89`
**Current:** Uses `window.prompt('Enter URL:')`
**Fix:** Create `UrlInputModal` component

**Implementation:**
1. Create `src/components/common/UrlInputModal.tsx`:
   - Modal overlay with keyboard support (Escape to close)
   - Text input with focus management
   - Enter to confirm, Escape to cancel
   - No ARIA attributes (as per design)
   - Desktop-optimized (no touch)
2. Update `RichTextEditor.tsx`:
   - Add state for modal visibility
   - Replace `window.prompt` with modal
   - Ensure keyboard navigation works

#### Fix 3: Replace window.confirm with In-App Dialog
**File:** `src/components/journal/EntryDetail.tsx:15`
**Current:** Uses `window.confirm('Are you sure...')`
**Fix:** Create `ConfirmDialog` component

**Implementation:**
1. Create `src/components/common/ConfirmDialog.tsx`:
   - Modal overlay with keyboard support
   - Message display
   - Confirm/Cancel buttons (keyboard accessible)
   - Enter to confirm, Escape to cancel
   - No ARIA attributes
   - Desktop-optimized
2. Update `EntryDetail.tsx`:
   - Add state for dialog visibility
   - Replace `window.confirm` with dialog
   - Ensure keyboard navigation works

### 🟡 Medium Priority Fixes

#### Fix 4: Memoize Filtering Logic
**File:** `src/App.tsx:77-91`
**Current:** Filtering runs on every render
**Fix:** Use `useMemo` for filtered entries

**Implementation:**
```typescript
import { useMemo } from 'react';

const filteredEntries = useMemo(() => {
  let result = entries;
  if (selectedMood) {
    result = filterByMood(selectedMood);
  }
  if (searchQuery) {
    const searchResults = searchEntries(searchQuery);
    if (selectedMood) {
      const moodFilteredIds = new Set(result.map(e => e.id));
      result = searchResults.filter(e => moodFilteredIds.has(e.id));
    } else {
      result = searchResults;
    }
  }
  return result;
}, [entries, selectedMood, searchQuery, filterByMood, searchEntries]);
```

#### Fix 5: Optimize useJournal Hook
**File:** `src/hooks/useJournal.ts`
**Current:** Functions depend on `entries` causing re-renders
**Fix:** Use functional updates

**Implementation:**
- Update `createEntry`, `updateEntry`, `deleteEntry` to use functional updates
- Remove `entries` from dependencies
- Example:
  ```typescript
  const createEntry = useCallback((entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      entryDate: entry.entryDate || new Date(),
    };
    setEntries(prev => {
      const newEntries = [newEntry, ...prev];
      const data = loadData();
      data.entries = newEntries;
      saveData(data);
      return newEntries;
    });
    return newEntry;
  }, []); // No dependencies
  ```

#### Fix 6: Add localStorage Size Monitoring
**File:** `src/lib/storage.ts`
**Current:** No size monitoring
**Fix:** Add size check and warning

**Implementation:**
1. Add helper function:
   ```typescript
   function getStorageSize(): number {
     let total = 0;
     for (let key in localStorage) {
       if (localStorage.hasOwnProperty(key)) {
         total += localStorage[key].length + key.length;
       }
     }
     return total;
   }
   ```
2. Check before save:
   ```typescript
   const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB
   const currentSize = getStorageSize();
   if (currentSize > MAX_STORAGE_SIZE * 0.9) {
     console.warn('Storage approaching limit. Consider exporting data.');
   }
   ```

### 🟢 Low Priority Fixes

#### Fix 7: Environment Check for Spotify Secret
**File:** `src/lib/spotify.ts`
**Current:** No production warning
**Fix:** Add environment check

**Implementation:**
```typescript
if (import.meta.env.PROD && import.meta.env.VITE_SPOTIFY_CLIENT_SECRET) {
  console.warn('⚠️ Client secret should not be in frontend in production! Use a backend proxy.');
}
```

#### Fix 8: Memoize Entry Components
**Files:** `EntryCard.tsx`, `EntryListItem.tsx`, `EntryCompactItem.tsx`
**Fix:** Wrap with `React.memo`

**Implementation:**
```typescript
export const EntryCard = React.memo(({ entry, onClick }: EntryCardProps) => {
  // ... existing code
}, (prev, next) => 
  prev.entry.id === next.entry.id && 
  prev.entry.updatedAt === next.entry.updatedAt
);
```

#### Fix 9: Fix Tiptap Editor Content Sync
**File:** `src/components/journal/RichTextEditor.tsx`
**Current:** Potential infinite loop risk
**Fix:** Add ref to track updates

**Implementation:**
```typescript
const isUpdatingFromProp = useRef(false);

useEffect(() => {
  if (editor && content !== editor.getHTML() && !isUpdatingFromProp.current) {
    isUpdatingFromProp.current = true;
    editor.commands.setContent(content);
    setTimeout(() => { isUpdatingFromProp.current = false; }, 0);
  }
}, [content, editor]);

// In onUpdate:
onUpdate: ({ editor }) => {
  if (!isUpdatingFromProp.current) {
    onChange(editor.getHTML());
  }
},
```

---

## Testing Requirements

After implementing fixes:

1. **Keyboard Navigation Test:**
   - Tab through all new modals/dialogs
   - Enter/Space to activate buttons
   - Escape to close modals
   - Arrow keys in segmented controls

2. **Security Test:**
   - Verify DOMPurify sanitizes malicious HTML
   - Test with XSS payloads in entry content

3. **Performance Test:**
   - Verify filtering is memoized (check React DevTools)
   - Verify fewer re-renders in useJournal hook

4. **UX Test:**
   - Verify modals are keyboard accessible
   - Verify modals match app styling
   - Verify smooth animations

5. **Design Compliance Test:**
   - No ARIA attributes added
   - No touch handlers added
   - No mobile-specific code
   - Desktop-only optimizations

---

## Implementation Order

1. Install dependencies (DOMPurify)
2. Create common components (UrlInputModal, ConfirmDialog)
3. Implement high-priority fixes (XSS, modals)
4. Implement medium-priority fixes (performance)
5. Implement low-priority fixes (optimizations)
6. Test all fixes
7. Verify design compliance

---

## Success Criteria

- ✅ All high-priority fixes implemented
- ✅ All medium-priority fixes implemented
- ✅ All low-priority fixes implemented
- ✅ Keyboard navigation works on all new components
- ✅ No ARIA attributes added
- ✅ No touch handlers added
- ✅ Performance improvements verified
- ✅ Security fixes verified
- ✅ Code builds without errors
- ✅ TypeScript strict mode passes

---

## Files to Create/Modify

**New Files:**
- `src/components/common/UrlInputModal.tsx`
- `src/components/common/ConfirmDialog.tsx`

**Modified Files:**
- `src/components/journal/EntryDetail.tsx`
- `src/components/journal/RichTextEditor.tsx`
- `src/App.tsx`
- `src/hooks/useJournal.ts`
- `src/lib/storage.ts`
- `src/lib/spotify.ts`
- `src/components/journal/EntryCard.tsx`
- `src/components/journal/EntryListItem.tsx`
- `src/components/journal/EntryCompactItem.tsx`

**Package Updates:**
- `package.json` (add dompurify, @types/dompurify)

---

**Ready for Implementation**

