# Development Workflow Agreement

This document outlines the agreed-upon development workflow for the AI-Enhanced Product Workflow Demo project.

---

## Plan-Driven Development

### Source of Truth
- **`doc/plan.md`** is the single source of truth for development progress
- All completed and outstanding work is tracked in plan.md
- Progress is tracked using checkboxes: `- [ ]` (pending) and `- [x]` (completed)

### Workflow Process

1. **Before Starting Work**
   - Review plan.md to identify the next step
   - Ensure previous steps are completed
   - If starting a new task not in the plan, update plan.md first

2. **During Development**
   - Follow the incremental steps defined in plan.md
   - Complete each step fully before moving to the next
   - Test and validate according to the validation criteria in each step

3. **Manual Validation & Testing**
   - After completing implementation, suggest specific manual validation steps to the user
   - Wait for user confirmation that validation passed before marking step as complete
   - Be transparent about what can/cannot be automatically validated
   - Never mark UI/browser-based features as validated without user confirmation

   **Validation Suggestions Should Include:**
   - Specific actions to perform (e.g., "Click the CSM input field and type a message")
   - Expected outcomes (e.g., "You should see the message appear in the chat window")
   - Regression checks (e.g., "Verify the PM and Engineering windows still work")
   - Edge cases if applicable (e.g., "Try sending an empty message")

   **Example Validation Prompt:**
   ```
   Step X.X is implemented. To validate:
   1. Open http://localhost:5173 in your browser
   2. [Specific action to test new feature]
   3. [Specific action to test existing features still work]

   Please confirm:
   - Does [new feature] work as expected?
   - Do [existing features] still work (no regression)?
   ```

4. **After Validation Confirmed**
   - Update plan.md to check off completed items (`- [ ]` → `- [x]`)
   - Mark validation criteria as met with ✓
   - Commit both the code changes and the updated plan.md

5. **When Plans Change**
   - If requested work doesn't align with current plan, pause and update plan.md first
   - Discuss and agree on plan changes before implementing
   - Keep plan.md synchronized with actual development direction

### Benefits of This Approach

- **Clear Progress Tracking** - Always know what's done and what's next
- **Prevents Scope Creep** - Explicit discussion when deviating from plan
- **Documentation** - Plan.md serves as development history
- **Incremental Validation** - Each step has clear success criteria
- **Coordination** - Multiple contributors can see status at a glance

---

## Development Guidelines

### Incremental Steps
- Each step should be small and focused (1-4 hours of work)
- Steps should be independently testable
- Steps should produce working, testable code
- If a step feels too large, break it down further

### Testing Requirements
- Each step includes validation criteria in plan.md
- AI assistant suggests specific manual validation steps after implementation
- User performs manual testing and confirms results
- Steps are only marked complete after user validation confirmation
- Keep validation criteria realistic and practical
- Focus on both new functionality and regression prevention

### Commitment Discipline
- Only check off items that are truly complete AND validated by user
- If implementation is done but not validated, wait for user confirmation
- If partially done, leave unchecked and add notes if needed
- Be honest and transparent about what has been tested vs. what needs manual validation
- Never assume UI/browser features work without user confirmation

---

## Quick Reference

**Where is the plan?** → `doc/plan.md`

**How to mark complete?** → Change `- [ ]` to `- [x]`

**What if I want to do something else?** → Update plan.md first, then proceed

**When to update plan.md?** → Immediately after completing a step

---

**Established:** 2025-11-23
