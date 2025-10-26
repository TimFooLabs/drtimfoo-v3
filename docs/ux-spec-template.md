---
title: "Universal UX Specification Template"
description: "A reusable UX specification template optimized for Next.js 16 + ShadCN UI + ShadCN MCP"
instructions: |
  1. Copy this file into your Next.js repo under `/docs/ux-specs/template.md`.
  2. Duplicate and rename for each project (e.g. `/docs/ux-specs/posture-analysis.md`).
  3. Fill in sections 1–5 with project-specific details.
  4. Use ShadCN MCP tools (`get_component`) to retrieve real UI patterns for section 4.
  5. Keep sections 6–10 consistent across projects for accessibility and maintainability.
  6. Before handoff, generate annotated Figma wireframes and link them in section 10.
---

# 🧩 UNIVERSAL UX SPECIFICATION TEMPLATE  
**Optimized for Next.js 16 + ShadCN UI + ShadCN MCP**

---

## **1. Project Overview**
**Purpose:**  
Describe what the app does, who it serves, and what key outcomes it aims to achieve.

**Example:**  
> A clinician-facing web app for assessing, tracking, and guiding posture improvement in patients. Built as a responsive Progressive Web App using Next.js 16, ShadCN UI, and ShadCN MCP to ensure a modular and intelligent UX.

---

## **2. User Personas & Context**
List the main types of users, their goals, and the environment of use.  
| Persona | Goal | Context | Device |
|----------|------|----------|---------|
| Clinician | Efficiently assess and record patient posture | Clinic | Tablet/Desktop |
| Patient | Review progress and learn exercises | Home | Mobile/Tablet |

*General tip:* Keep personas outcome-based rather than role-based for reuse.

---

## **3. Core User Journey**
Use this to define **the logical stages** of the app, not just screens.  
Each stage should describe:
- **Objective**
- **Key Actions**
- **UI/UX Considerations**
- **Data Inputs/Outputs**

**Template Structure:**
```markdown
#### Stage X: [Name]
- **Objective:** What the user wants to achieve
- **Entry Point:** Where this flow begins
- **Key Actions:** [list of actions or interactions]
- **Data Inputs:** [fields or parameters, e.g. name, age, metrics]
- **Data Outputs:** [computed results, status, recommendations]
- **UX Notes:** [progressive disclosure, validation, affordance design]
- **Tech Hooks:** [API calls, component states, MCP interactions]
```

*Example (for posture app):*
```markdown
#### Stage 1: Capture
- **Objective:** Acquire structured photo data for analysis.
- **Entry Point:** Dashboard → “New Assessment”
- **Key Actions:** Upload or live capture
- **Data Inputs:** Patient ID, View Type
- **Data Outputs:** Landmark coordinates, metadata
- **UX Notes:** Real-time feedback with AR overlay; clear error handling
- **Tech Hooks:** Use `mcp.get_component("camera")` + ShadCN modal wrapper
```

---

## **4. UI Component Architecture**
Describe **modular building blocks** that compose the UI.  
This section is intentionally general — reusable across projects.

**Template Structure:**
```markdown
#### Component Group: [e.g., Forms / Visualization / Navigation]
- **Primary Components:**
  - [Component Name]: [Purpose]
- **UI States:**
  - Default
  - Loading
  - Empty
  - Error
- **ShadCN Pattern Used:** [component name from `get_component`]
- **MCP Pattern Reference:** [tool or template pattern name]
- **Interactivity:** [click, hover, drag, etc.]
- **Accessibility Notes:** [ARIA roles, contrast, keyboard flow]
```

*Example:*
```markdown
#### Component Group: Data Visualization
- **Primary Components:**
  - ProgressChart: shows metric changes over time
- **UI States:** Loading, Empty, Error
- **ShadCN Pattern Used:** `chart-card`
- **MCP Pattern Reference:** `analytics_trend`
- **Accessibility Notes:** Provide textual summaries for all chart data
```

---

## **5. Data Schema & Interaction Layer**
Define what data flows through the UI and how it’s exchanged.

```markdown
| Field | Type | Source | Used In | Validation |
|--------|------|---------|---------|-------------|
| user_id | UUID | Supabase | All | Required |
| metric_name | string | API | Charts | Enum |
| value | number | Calculation | Charts | Optional |
```

> 🧠 Tip: Keep schemas close to UI context rather than full backend models for speed of iteration.

---

## **6. System Feedback & Microinteractions**
For each type of feedback (success, warning, info, error), define:
- **Visual cue** (color, icon, motion)
- **Timing** (toast vs modal)
- **Tone** (friendly, clinical, etc.)

*Example:*
| State | Style | Duration | UX Behavior |
|--------|--------|-----------|--------------|
| Success | Green toast w/ check icon | 2s | Auto-dismiss |
| Warning | Amber toast | Sticky | Requires acknowledgment |

---

## **7. Recommendations for Implementation**
1. **Component Importing**  
   Use MCP command:  
   ```bash
   mcp get_component "componentName"
   ```  
   to retrieve ready-to-use ShadCN v4 code patterns.

2. **Folder Structure (Next.js 16)**  
   ```
   /app
     /[route]
       page.tsx
       layout.tsx
   /components
     /ui
     /blocks
   /lib
     /mcp
     /hooks
   ```

3. **Integration Best Practices**
   - Use `next/navigation` for transitions.
   - Wrap forms with `react-hook-form`.
   - Persist global UI state via `use-store` or `jotai`.
   - Use MCP hooks for auto-completion of UI patterns.

---

## **8. Accessibility & Performance**
- Lighthouse score target: **≥90**
- Keyboard navigation: **100% coverage**
- Motion preference: respect `prefers-reduced-motion`
- Image loading: `next/image` with `priority` only where needed

---

## **9. Future Extensibility**
| Layer | Direction | Example Extension |
|--------|------------|------------------|
| UI | New ShadCN components | “TimelineCard” for trends |
| Logic | AI reasoning via MCP | “Explain deviation significance” |
| Data | Add analytics logging | Supabase or Convex |

---

## **10. Handoff Notes**
- Export to Figma using structure:
  ```
  [Flow Name] > [Stage] > [Component Group]
  ```
- Annotate every interactive element with:  
  - `[action]` → `[feedback]`  
  - `[state]` → `[transition]`
