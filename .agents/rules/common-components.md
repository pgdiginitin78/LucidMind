# Common UI Components Rule

Whenever building, modifying, or refactoring UI elements, always use the shared components located inside `frontend/common/`:

1. **Form Fields**:
   - Always use `@/common/formFields/*` (e.g. `InputField`, `SelectField`, `TextAreaField`, etc.).
   - NEVER use plain/raw HTML `<input>`, `<select>`, or `<textarea>` tags for forms.

2. **Buttons**:
   - Always use `@/common/button/*` (e.g. `CommonButton`, `CancelButtonModal`).

3. **Tables**:
   - Always use `@/common/table/*` for data tables and list displays.

4. **Toasts & Feedback**:
   - Always use `@/common/toast/*` (`CustomToast`) for alert, error, and success feedback.

5. **Modals & Loaders**:
   - Use `@/common/ConfirmationModal` and `@/common/commonLoader/*`.
