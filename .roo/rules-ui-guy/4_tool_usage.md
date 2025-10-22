# Tool Usage Guide

## Tool Priorities

### Priority 1: codebase_search
- **When**: Always use first to find relevant existing code and patterns
- **Why**: Semantic search finds functionality better than keyword search, helping you understand existing implementations before building new ones

**Example**:
- **Scenario**: Building a task management feature
- **Query**: "task management components" or "todo list implementation"

### Priority 2: use_mcp_tool (shadcn-ui)
- **When**: Before using any shadcn/ui component, query the MCP server for current API documentation
- **Why**: Ensures you're using the most up-to-date component API and understand all available props and variants

**Example**:
- **Scenario**: Need to use a Dialog component
- **Command**: Use shadcn-ui MCP server to get Dialog component documentation

### Priority 3: read_file
- **When**: After identifying relevant files with codebase_search, examine the full implementation
- **Why**: Get complete context of existing implementations, patterns, and dependencies

**Example**:
- **Scenario**: Found TaskList component in search results
- **Action**: Read the complete TaskList.tsx file to understand its structure and dependencies

### Priority 4: execute_command
- **When**: For installing dependencies, running development servers, and deploying
- **Why**: Automates setup and deployment processes following MVP principles

## Tool Specific Guidance

### codebase_search
**Best Practices**:
- Use semantic, natural language queries that describe functionality
- Search for existing patterns before building new components
- Include technology names in queries (Next.js, Convex, shadcn)
- Search for both components and their related files (actions, schemas)

**Example Queries**:
- **Component**: "user authentication components with Clerk"
- **Pattern**: "form submission with server actions"
- **Integration**: "Convex data fetching in server components"
- **Styling**: "responsive grid layouts with Tailwind"

**Workflow Integration**:
1. Always start with codebase_search to understand existing patterns
2. Analyze search results to identify reusable components
3. If no relevant patterns exist, proceed with new implementation
4. Document new patterns for future reference

### use_mcp_tool (shadcn-ui)
**Best Practices**:
- Always follow the complete MCP workflow: survey → analyze → acquire → implement
- Use list_components to survey all available components first
- Analyze requirements to determine which component(s) best suit implementation needs
- Get implementation details via get_component_demo for comprehensive examples or get_component_preview for quick overviews
- Follow exact patterns and structures revealed by MCP tools
- Maintain consistency with existing codebase architecture
- Adhere to project's established conventions for component integration and styling

**MCP Workflow**:
1. Survey all available components using list_components
2. Analyze implementation requirements to identify suitable components
3. Get comprehensive implementation details using get_component_demo for full examples OR get_component_preview for quick overviews
4. Install component via CLI: npx shadcn@latest add [component]
5. Implement following exact patterns from MCP tool responses
6. Ensure consistency with existing codebase architecture

**Detailed Workflow**:

#### Survey Phase: Survey Available Components
- **Action**: Call list_components to see all available shadcn-ui components
- **Example Command**: `use_mcp_tool` with shadcn-ui server, list_components tool
- **Outcome**: Complete list of available components with descriptions

#### Analyze Phase: Analyze Requirements
- **Action**: Review implementation needs and match to available components
- **Criteria**:
  - Component functionality matches requirements
  - Component complexity fits MVP timeline
  - Component integrates well with existing architecture

#### Acquire Phase: Acquire Implementation Details
- **Primary Action**: Use get_component_demo for comprehensive demonstration examples when you need full implementation details
- **Secondary Action**: Use get_component_preview for quick implementation overviews when component is simple or familiar

**Decision**: Do you need comprehensive implementation details?
- **Yes**: Use get_component_demo for full examples, props, and usage patterns
- **No**: Use get_component_preview for quick overview and basic implementation

#### Implement Phase: Implement Following MCP Patterns
- Install component via CLI
- Follow exact patterns revealed by MCP tools
- Maintain consistency with existing codebase
- Adhere to project conventions

**Example Usage**:
- **Scenario**: Implementing a user onboarding flow with multiple steps

**Process**:
1. `use_mcp_tool`: list_components - Survey all available components
2. Analysis: Identify need for Dialog, Button, Input, and Card components
3. `use_mcp_tool`: get_component_demo for Dialog component (complex modal needs full examples)
4. `use_mcp_tool`: get_component_preview for Button component (familiar simple component)
5. `use_mcp_tool`: get_component_demo for Card component (need layout examples)
6. `execute_command`: Install components: npx shadcn@latest add dialog button card input
7. Implementation: Implement onboarding flow following exact MCP patterns

### use_mcp_tool (origin-ui)
**Best Practices**:
- Use origin-ui as alternative when shadcn-ui doesn't have suitable components
- Follow same survey → analyze → acquire → implement workflow
- Use search_components to find specific component types
- Get component details and previews before implementation
- Check component screenshots for visual compatibility

**Origin-UI Workflow**:
1. Search for components using search_components with specific queries
2. Review search results and analyze component suitability
3. Get detailed component information using get_component_details
4. Get visual preview using get_component_screenshot
5. Get installation command using get_install_command
6. Install and implement following the exact patterns provided

**Example Usage**:
- **Scenario**: Need a specialized component not available in shadcn-ui

**Process**:
1. `use_mcp_tool`: search_components with query like "pricing table" or "testimonial card"
2. Analysis: Review search results for suitable components
3. `use_mcp_tool`: get_component_details for promising components
4. `use_mcp_tool`: get_component_screenshot to verify visual design
5. `use_mcp_tool`: get_install_command to get installation instructions
6. Implementation: Install and implement following provided patterns

### execute_command
**Best Practices**:
- Use npm run commands for project-specific scripts
- Always work from the project root directory
- Check package.json for available scripts before running
- Use development servers for testing before deployment

**Essential Commands**:
- **Development**: `npm run dev` - Start Next.js development server (Always run when implementing new features)
- **Convex Dev**: `npx convex dev` - Start Convex backend development server (Required for any Convex functionality)
- **Install shadcn**: `npx shadcn@latest add [component]` - Install shadcn/ui components (Always use CLI, never manual installation)
- **Deploy Backend**: `npx convex deploy` - Deploy Convex backend to production (Before frontend deployment)
- **Deploy Frontend**: `vercel --prod` - Deploy frontend to Vercel production (After backend deployment)

**Development Workflow**:
1. Start development servers (npm run dev + npx convex dev)
2. Implement feature following MVP principles
3. Test in development environment
4. Deploy backend (npx convex deploy)
5. Deploy frontend (vercel --prod)
6. Test in production and collect feedback

### apply_diff
**Best Practices**:
- Always read file first to ensure exact content match
- Make multiple related changes in a single diff operation
- Include line numbers for accuracy and reliability
- Use for surgical edits, not complete file rewrites

**When to use**:
- Adding imports to existing components
- Modifying specific functions or methods
- Updating configuration files
- Fixing bugs in existing code

**Example**:
- **Scenario**: Adding authentication check to existing page

```tsx
<apply_diff>
<path>app/dashboard/page.tsx</path>
<diff>
<<<<<<< SEARCH
:start_line:1
-------
import TaskManager from "@/components/TaskManager";

export default async function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <TaskManager />
    </div>
  );
}
=======
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TaskManager from "@/components/TaskManager";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <TaskManager />
    </div>
  );
}
>>>>>>> REPLACE
</diff>
</apply_diff>
```

### write_to_file
**Best Practices**:
- Use for creating new files or complete rewrites
- Always provide complete file content, no placeholders
- Include proper imports and exports
- Follow established file naming conventions

**When to use**:
- Creating new components
- Creating new pages
- Creating Convex functions
- Creating configuration files

**MVP File Creation**:
- **New Component**: `components/[ComponentName].tsx` - Use common patterns from 3_common_patterns.xml
- **New Page**: `app/[route]/page.tsx` - Include authentication checks and layout
- **Convex Function**: `convex/[feature].ts` - Include proper authentication and validation

### ask_followup_question
**Best Practices**:
- Provide 2-4 specific, actionable suggestions
- Order suggestions by likelihood or importance
- Make suggestions complete (no placeholders)
- Include mode switches when appropriate

**Usage Scenarios**:
- **Feature scope clarification**:
  - **Question**: Is this feature critical for the MVP (must ship in 7 days) or can it be added post-MVP?
  - **Suggestions**:
    - Critical for MVP - implement immediately with basic functionality
    - Post-MVP enhancement - add to backlog for user feedback iteration
    - Unsure - let's check if it affects the core user journey

**MVP Decision Questions**:
- Can this feature be implemented in under 30 minutes using existing libraries?
- Does this solve the ONE core problem we're addressing?
- Is there a simpler way to achieve 80% of the value?

### switch_mode
**Best Practices**:
- Use when current mode lacks required capabilities
- Provide clear reason for mode switch
- Choose appropriate mode for the specific task

**Mode Switch Scenarios**:
- **ui-guy → code**: Need to implement complex backend logic or database operations
- **ui-guy → architect**: Need to plan complex feature architecture or system design
- **ui-guy → debug**: Encountering complex errors that need systematic debugging

## Integration Workflows

### Implement New Feature Workflow
1. `codebase_search`: Search for existing similar components or patterns
2. `read_file`: Examine relevant existing implementations
3. `use_mcp_tool` (shadcn-ui): list_components - Survey all available components
4. Analysis: Analyze requirements and identify suitable components
5. `use_mcp_tool` (shadcn-ui): get_component_demo or get_component_preview - Acquire implementation details
6. `execute_command`: Install required components via CLI
7. `write_to_file`: Create new components following exact MCP patterns
8. `apply_diff`: Update existing files to integrate new components
9. `execute_command`: Start development server for testing

### Setup New Project Workflow
1. `execute_command`: Initialize Next.js project with TypeScript and Tailwind
2. `execute_command`: Add Convex and start development server
3. `execute_command`: Add Clerk authentication
4. `execute_command`: Initialize shadcn/ui
5. `write_to_file`: Create basic project structure and configuration
6. `execute_command`: Verify all services are running correctly

### Deploy to Production Workflow
1. `execute_command`: Deploy Convex backend to production
2. `execute_command`: Deploy frontend to Vercel
3. `execute_command`: Test production deployment
4. `ask_followup_question`: Confirm MVP completion criteria are met

### Complete MCP Component Implementation Workflow
End-to-end workflow for implementing components using MCP servers

**Steps**:
1. `use_mcp_tool` (shadcn-ui): list_components - Survey all available components
2. Analysis: Analyze implementation requirements and identify component needs
3. `use_mcp_tool` (shadcn-ui): get_component_demo for complex components OR get_component_preview for simple components
4. Alternative: If no suitable shadcn component found, use origin-ui workflow
5. `use_mcp_tool` (origin-ui): search_components with specific query
6. `use_mcp_tool` (origin-ui): get_component_details and get_component_screenshot
7. `execute_command`: Install selected components via CLI
8. `write_to_file`: Implement following exact MCP-provided patterns
9. `apply_diff`: Integrate with existing codebase maintaining consistency
10. `execute_command`: Test implementation in development

**Decision Points**:
- **Question**: Is suitable component available in shadcn-ui?
  - **Yes**: Continue with shadcn-ui workflow
  - **No**: Switch to origin-ui workflow
- **Question**: Is component complex or unfamiliar?
  - **Yes**: Use get_component_demo for comprehensive examples
  - **No**: Use get_component_preview for quick overview

## MVP Tool Principles

### Speed Over Perfection
Use tools that enable rapid development and iteration

**Application**:
- Prefer CLI installations over manual setup
- Use existing components over custom implementations
- Leverage development servers for quick testing

### Automation
Automate repetitive tasks to focus on core functionality

**Application**:
- Use shadcn CLI for component installation
- Use deployment commands for production releases
- Use development servers for hot reloading

### Validation
Continuously validate implementation through testing

**Application**:
- Use development servers for immediate feedback
- Test in production before claiming completion
- Use search tools to validate against existing patterns
