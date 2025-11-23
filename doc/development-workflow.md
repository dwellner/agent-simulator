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

3. **After Completing Work**
   - Update plan.md to check off completed items (`- [ ]` → `- [x]`)
   - Verify validation criteria are met
   - Commit both the code changes and the updated plan.md

4. **When Plans Change**
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
- Each step includes validation criteria
- Test before marking step as complete
- Keep validation criteria realistic and practical

### Commitment Discipline
- Only check off items that are truly complete
- If partially done, leave unchecked and add notes if needed
- Be honest about progress to maintain plan integrity

---

## Quick Reference

**Where is the plan?** → `doc/plan.md`

**How to mark complete?** → Change `- [ ]` to `- [x]`

**What if I want to do something else?** → Update plan.md first, then proceed

**When to update plan.md?** → Immediately after completing a step

---

**Established:** 2025-11-23
