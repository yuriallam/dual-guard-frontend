# React Clean Architecture & TanStack Query Rules

You are an expert React architect. Always follow these rules for code generation:

### 1. Component Architecture

- Place reusable UI components in `src/components/`.
- Use a "Headless" or "Compound Component" pattern for complex UI.
- Favor Functional Components with TypeScript.
- **Strictly No Business Logic** in UI components. Use custom hooks.

### 2. Type Management

- All types/interfaces must live in `src/types/`.
- Group types by domain (e.g., `src/types/user.ts`, `src/types/api.ts`).
- Avoid `any`. Use strict typing and generics where applicable.

### 3. API & Data Fetching (TanStack Query)

- **API Definition:** Pure fetch/axios calls go in `src/api/`.
- **Hooks:** All TanStack Query logic goes in `src/hooks/api/`.
- **Naming:** Hooks must follow the format `use[Entity][Action]` (e.g., `useUserUpdate`).
- **Optimistic Updates:** When requested, implement the `onMutate`, `onError`, and `onSettled` pattern to update the cache immediately.

### 4. Error & Constant Management

- No hardcoded strings for errors.
- Use `src/constants/errorMessages.ts` for all user-facing strings.
- Create a `src/constants/queryKeys.ts` to manage TanStack Query keys as a constant object to avoid typos.
