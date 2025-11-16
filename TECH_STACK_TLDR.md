# Tech Stack TL;DR

Quick reference for tech stacks used across projects in this repository.

**💡 Shared Templates:** See [`templates/`](../templates/) for shared config files and utilities to speed up new project setup.

---

## 🎨 LiveJournal Clone

**Core:**
- React 18 + TypeScript + Vite
- Tailwind CSS
- Tiptap (rich text editor)
- Lucide React (icons)
- date-fns (date formatting)

**Data:**
- localStorage (all data)
- React Hooks (useState, useEffect, useCallback)

**External:**
- Spotify Web API (OAuth 2.0)

**No:**
- Backend/server
- Database
- State management library (just hooks)

---

## 🔧 JIRA Wrapper

**Core:**
- React 18 + TypeScript + Vite
- Tailwind CSS
- React Query v5 (TanStack Query)
- Lucide React (icons)
- date-fns (date formatting)

**Data:**
- localStorage (credentials, cache, preferences)
- React Query (API calls, caching, state)

**External:**
- JIRA REST API v3 (Basic Auth)

**No:**
- Backend/server
- Database
- Rich text editor

---

## 🎵 Last.fm Clone (lastfm-clone)

**Core:**
- React 18 + TypeScript + Vite
- Tailwind CSS (dark mode via class-based)
- React Query v5 (TanStack Query)
- Lucide React (icons)
- date-fns (date formatting)
- clsx (className utilities)

**Data:**
- localStorage (history, preferences, tokens)
- React Query (API calls, caching, state)

**External:**
- Spotify Web API (OAuth 2.0, REST)

**Key Decisions:**
- ✅ No backend — client-side only
- ✅ Single-user — localStorage persistence
- ✅ TypeScript strict mode
- ✅ No CSS-in-JS — Tailwind only
- ✅ No UI library — custom components

**No:**
- Backend/server
- Database
- Rich text editor

---

## 📊 Comparison

| Feature | LiveJournal | JIRA Wrapper | Last.fm Clone |
|---------|------------|--------------|---------------|
| **Framework** | React 18 + TS | React 18 + TS | React 18 + TS |
| **Build** | Vite | Vite | Vite |
| **Styling** | Tailwind | Tailwind | Tailwind |
| **Editor** | Tiptap | None | None |
| **Data Fetching** | Hooks only | React Query | React Query |
| **External API** | Spotify | JIRA | Spotify |
| **Storage** | localStorage | localStorage | localStorage |
| **Icons** | Lucide | Lucide | Lucide |

---

## 🎯 TLDR

**All Three:** React + TypeScript + Vite + Tailwind + localStorage  
**LiveJournal:** + Tiptap + Spotify API (hooks only)  
**JIRA:** + React Query + JIRA API  
**Last.fm:** + React Query + Spotify API

**Architecture:** Client-side only, no backend, desktop-only, single-user.
