# React 19 + Chakra UI Improvements

## What changed from the basic version

### React 19 Features
1. **`useOptimistic`** (Roster component)
   - When you add a clinician/patient, it appears in the list *immediately*
   - No loading spinner, no delay
   - The server request happens in the background
   - If it fails, the optimistic item is removed and a toast shows the error

2. **React Hook Form integration**
   - Replaces manual `useState` for form fields
   - Declarative validation (inline `required`, `pattern`, etc.)
   - Minimal re-renders (only the field being edited re-renders)
   - Built-in error messages tied to each field

### UI & Design (Chakra)
1. **Component library** instead of custom CSS
   - Buttons, inputs, selects, modals all have consistent sizing and spacing
   - No custom border-radius, padding inconsistencies
   - Theme system for dark mode (one source of truth)

2. **Accessibility built-in**
   - Chakra enforces ARIA labels and keyboard navigation
   - Focus states are handled
   - Color contrast is accessible by default

3. **Responsive design**
   - Layout goes from 2-column (desktop) to 1-column (mobile) automatically
   - `flexDirection={{ base: "column", lg: "row" }}` vs custom media queries

4. **Dark mode**
   - `_dark={{ ... }}` syntax for dark overrides
   - Respects `prefers-color-scheme` system setting
   - No manual theme toggling needed

### Error Handling & Reliability
1. **Error Boundary** (ErrorBoundary.jsx)
   - If React crashes (e.g., a component throws), the app doesn't go blank
   - Shows a friendly error message instead

2. **Server-side error handling**
   - All endpoints wrapped in try/catch
   - Database failures return 500 with a message, not 200 with nothing
   - Validation happens both on client and server

3. **Toast notifications**
   - Success/error messages appear as toasts (small alerts)
   - No reliance on browser alerts
   - Auto-dismiss or user can close

4. **Form loading states**
   - Buttons show `isLoading` spinner
   - Form fields are disabled while submitting
   - No double-submit possible

### Testing
8 test cases covering:
- Creating records
- Rejecting bad input
- Filtering and sorting
- Error cases (non-existent IDs, invalid dates)

Run with: `npm test --prefix server`

## Bundle size comparison
- **Before**: Custom CSS + React + ReactDOM ≈ 50KB gzipped
- **After**: React 19 + Chakra + React Hook Form ≈ 80KB gzipped
  - Worth it for: accessibility, theme system, error handling, validation

## What you'd explain in an interview

> "I upgraded to React 19 to use `useOptimistic`, which gives instant UI feedback. When a user adds a clinician, it appears in the list before the server responds. If the server rejects it, React automatically rolls back the optimistic update.
> 
> I chose Chakra UI over Material-UI because it's lighter and has native dark mode. The theme system means I don't have to think about color tokens across the app—they're centralized.
> 
> React Hook Form reduced form complexity: no more `useState` for every field, just declarative validation. Chakra handles the styling, React Hook Form handles the state.
> 
> I added an ErrorBoundary so if React crashes, users see an error page instead of a blank screen. The server now wraps all database calls in try/catch, so we never return a 200 if something goes wrong.
> 
> And I added tests: 8 cases covering happy paths and failures. This signals I care about stability, not just features."

## Next steps
- Replace `supertest@6` with `supertest@7+` (just `npm install supertest@latest --save-dev`)
- Add a modal for editing visits (with an Edit button per row)
- Pagination for the visit log
- Export to CSV
