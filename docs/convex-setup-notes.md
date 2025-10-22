# Convex Integration Setup Notes

## Problem Solved

This document explains the configuration changes made to resolve TypeScript compilation and bundling conflicts when using Convex with Next.js.

### Original Errors
- `error TS5055: Cannot write file '/convex/_generated/api.js' because it would overwrite input file`
- `Two output files share the same path but have different contents: out/bookings.js`

## Root Causes

### 1. Conflicting TypeScript Compilation
- Next.js `tsc` typecheck included the entire project (`**/*.ts`)
- This conflicted with Convex's own compilation of `convex/` functions
- Convex generates files in `convex/_generated/` that TypeScript treated as input files

### 2. Bundling Conflicts
- Convex generates `.js` files inline with `.ts` source files during `convex dev`
- Next.js bundler tried to process both source and generated files
- Multiple build processes writing to same output paths (`out/` directory)

## Solutions Implemented

### 1. TypeScript Configuration Separation
**File: `tsconfig.json`**
```json
{
  "exclude": ["node_modules", "convex"]
}
```
- Excludes `convex/` directory from Next.js TypeScript compilation
- Allows Convex to manage its own compilation independently

### 2. Convex Output Directory Separation
**File: `convex/tsconfig.json`**
```json
{
  "compilerOptions": {
    "outDir": "../../.convex-out",
    "noEmit": true
  }
}
```
- Directs Convex compilation output to separate `.convex-out/` directory
- Prevents inline `.js` file generation that caused bundling conflicts

### 3. Version Control Hygiene
**File: `.gitignore`**
```
# convex generated files
convex/*.js
convex/*.d.ts
convex/_generated/
.convex-out/
```
- Ignores generated Convex files from version control
- Prevents accidental commits of build artifacts

## Development Workflow

### Normal Development
1. Run `bun run convex:dev` - Develop Convex functions
2. Run `bun run dev` - Develop frontend (can run simultaneously)
3. Run `bun run typecheck` - Check types across project
4. Run `bun run build` - Build for production

### File Organization
- `convex/*.ts` - Convex function source code (committed)
- `convex/_generated/` - Auto-generated TypeScript types (ignored)
- `.convex-out/` - Convex compiled JavaScript (ignored)
- No `.js` files in `convex/` directory during normal development

## Important Notes for Future Developers

### DO NOT:
- Add `"convex"` back to `tsconfig.json` includes - breaks typecheck
- Remove `"outDir"` from `convex/tsconfig.json` - causes bundling conflicts
- Commit generated `.js` files to `convex/` directory - they'll conflict
- Change `.gitignore` rules for `.convex-out/` and `convex/_generated/`

### DO:
- Keep Convex functions as `.ts` files only (no `.js` counterparts)
- Run `convex dev` for function development and testing
- Use `convex deploy` to push functions to production
- Keep Next.js and Convex development processes separate

### Troubleshooting
If you encounter bundling conflicts:
1. Ensure `convex/` is excluded from root `tsconfig.json`
2. Check that Convex output is going to `.convex-out/` (not inline)
3. Verify `.gitignore` rules are excluding generated files
4. Delete any accidentally committed `.js` files in `convex/` directory

## Dependencies
- `convex` - Backend functions and database
- `next` - Frontend framework
- `@clerk/nextjs` - Authentication (separate from Convex)
- Scripts configured for separate development workflows
