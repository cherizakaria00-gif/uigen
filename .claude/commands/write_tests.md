Write comprehensive tests for: $ARGUMENTS

Testing conventions for this project:
- Use Vitest with React Testing Library
- Place test files in a __tests__ directory in the same folder as the source file
- Name test files as [filename].test.ts(x)
- Use @/ prefix for imports

Coverage requirements:
- Test happy paths (normal usage)
- Test edge cases (empty input, loading state, disabled state)
- Test error states
- Test user interactions (clicks, typing, form submit)

Do not mock internal modules unless strictly necessary. Prefer testing behavior over implementation.
