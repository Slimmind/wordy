# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev           # start dev server
bun run build     # tsc + vite build
bun run lint      # ESLint (zero warnings allowed)
bun test          # vitest watch mode
bun run test:run  # vitest single run
```

Running a single test file: `bun run test:run src/schemas/item.schema.test.ts`

## Environment variables

Create a `.env` file with:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_OPENAI_API_KEY=
VITE_LOCAL_AI_URL=      # only needed when CURRENT_AI_PROVIDER = 'local'
```

## Architecture

**Wordy** is a React 19 PWA for vocabulary learning. Stack: Vite + TanStack Router + Redux Toolkit + Firebase/Firestore.

### Routing

`src/routes/` uses TanStack Router's file-based routing. `routeTree.gen.ts` is **auto-generated** by the Vite plugin — never edit it manually. Lazy routes use the `.lazy.tsx` naming convention.

### State management

`src/store/` holds three Redux slices:
- `auth` — Firebase Auth state (email/password + Google OAuth)
- `firestore` — vocabulary items (synced from Firestore via `listenToItems`)
- `theme` — light/dark preference

The root route (`__root.tsx`) subscribes to the entire Firestore `vocabulary` collection on mount. The comment there notes a known performance trade-off for large collections.

For component-level access to vocabulary, prefer the `useVocabulary()` hook (`src/hooks/useVocabulary.ts`) over dispatching store actions directly.

### Service layer

`src/services/firestore.ts` is a pure Firestore service with no Redux dependency. Prefer it for new data-fetching needs instead of adding more thunks to the store.

### AI providers

`src/ai/` implements a provider abstraction:

- `types.ts` — `AIProvider` interface
- `openai.provider.ts` — OpenAI GPT-3.5-turbo
- `local-ai.provider.ts` — local HTTP endpoint
- `provider-factory.ts` — returns the active provider

To switch AI providers, change `CURRENT_AI_PROVIDER` in `src/config.ts` (options: `'openai'` | `'local'`).

The extension flow: `useAIExtend` hook → `extendItem()` → `checkItemForExtending()` to find gaps → `createPrompt()` → provider → merge results back into item.

### Schemas and types

`src/schemas/item.schema.ts` contains the canonical Zod schemas and inferred TypeScript types (`ItemType`, `ItemDetailType`, etc.). `src/utils/constants.ts` exports legacy versions of the same types — these are deprecated; use the schema types for new code.

App-wide magic numbers (desired translation counts, debounce delays, etc.) live in `src/config.ts` as `APP_CONFIG`.
