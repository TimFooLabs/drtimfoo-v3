# Booking Page UX Specification
## Dr Tim Foo Chiropractic Practice

### 1. Overview

**Page Purpose:** The booking page serves as the primary conversion tool where prospective and existing patients can schedule chiropractic appointments with real-time availability checking and immediate confirmation.

**Primary User Goals:**
- Book new chiropractic appointments with confidence
- Select preferred date and time slots from available options
- Provide necessary patient information efficiently
- Receive immediate booking confirmation with all details
- Understand appointment preparation and next steps

**Business Objectives:**
- Convert website visitors into booked patients seamlessly
- Reduce administrative overhead through self-service booking
- Provide transparent availability information
- Ensure complete and accurate patient data collection
- Streamline the appointment scheduling workflow

### 2. User Journey Mapping

#### Stage 1: Discovery & Booking Entry
- **Objective:** User arrives with intent to book an appointment
- **Entry Point:** Homepage CTA, direct navigation, or marketing campaigns
- **Key Actions:**
  - View compelling headline about pain relief and wellness
  - Review trust indicators (credentials, experience, testimonials)
  - Access booking form immediately
  - Understand practice information and booking tips
- **Success Criteria:** User feels confident and proceeds to service selection

#### Stage 2: Service Selection & Information
- **Objective:** User selects appropriate chiropractic service
- **Entry Point:** Main booking form on `/booking` page
- **Key Actions:**
  - Review service options with pricing and duration
  - Select initial consultation, regular adjustment, or extended session
  - View detailed descriptions of each service type
  - See real-time service summary with pricing
- **Success Criteria:** User understands service options and makes appropriate selection

#### Stage 3: Date & Time Selection
- **Objective:** User chooses preferred appointment timing
- **Entry Point:** After service selection in booking form
- **Key Actions:**
  - Interactive calendar date selection with visual availability indicators
  - Time slot selection from available hours (9 AM - 5 PM, excluding lunch)
  - View booking density indicators for busy dates
  - Understand practice hours and scheduling constraints
- **Success Criteria:** User selects convenient date and time with confidence

#### Stage 4: Patient Information Collection
- **Objective:** User provides necessary details for appointment
- **Entry Point:** After date/time selection
- **Key Actions:**
  - Progressive disclosure form with essential fields only
  - Real-time validation with helpful error messages
  - Optional notes for specific concerns or preferences
  - Review complete booking summary before submission
- **Success Criteria:** User completes all required fields without confusion

#### Stage 5: Booking Confirmation & Next Steps
- **Objective:** User receives confirmation and understands next steps
- **Entry Point:** Successful form submission
- **Key Actions:**
  - View comprehensive booking confirmation details
  - Receive appointment status and booking ID
  - Understand preparation instructions and arrival timing
  - Access options to modify or cancel if needed
- **Success Criteria:** User feels confident about appointment and knows what to expect

#### Stage 6: Post-Booking Engagement
- **Objective:** User maintains engagement with practice
- **Entry Point:** Booking confirmation page
- **Key Actions:**
  - Navigate to booking history or management
  - Return to homepage for additional information
  - Share booking details if needed
  - Access patient resources and preparation materials
- **Success Criteria:** User has clear path to next actions and resources

### 3. Responsive Behavior

#### Mobile (< 768px)
- **Layout:** Single column stack with booking form first, then sidebar information
- **Navigation:** Touch-optimized calendar with large tap targets
- **Form:** Full-width input fields with mobile keyboard optimization
- **CTA:** Sticky bottom navigation with primary booking action
- **Performance:** Optimized for quick loading with minimal initial data

#### Tablet (768px - 1024px)
- **Layout:** Two-column grid with main booking form left, sidebar right
- **Interaction:** Support both touch and keyboard interactions
- **Calendar:** Enhanced touch targets while maintaining desktop functionality
- **Form:** Balanced layout with adequate spacing for touch interaction

#### Desktop (> 1024px)
- **Layout:** Multi-column layout with maximum information density
- **Interaction:** Full mouse interaction with hover states and tooltips
- **Calendar:** Rich interactions with density indicators and advanced navigation
- **Form:** Optimized for keyboard navigation and efficiency

### 4. UI Component Architecture

#### Primary Components
- **BookingForm** (`/src/components/features/booking/booking-form.tsx`)
  - Main form component with React Hook Form + Zod validation
  - Service selection with rich descriptions and pricing
  - Date picker with disabled dates and custom validation
  - Time slot generation (9 AM - 5 PM, excluding 12-1 PM lunch)
  - Real-time service summary display
  - Integration with Convex for booking creation

- **BookingCalendar** (`/src/components/features/booking/booking-calendar.tsx`)
  - Custom calendar implementation with availability indicators
  - Visual density indicators showing booking volume
  - Multi-month navigation with keyboard support
  - WCAG 2.1 AA accessibility compliance
  - Status indicators for booked/unavailable dates

- **BookingConfirmation** (`/src/components/features/booking/booking-confirmation.tsx`)
  - Post-booking confirmation display with Convex integration
  - Real-time status updates and booking details
  - Loading states and error handling
  - Navigation to booking history and additional actions

#### Supporting UI Components
- **ShadCN UI Components:**
  - `Card`, `CardHeader`, `CardContent` - Container and layout
  - `Form`, `FormField`, `FormItem` - Form structure and validation
  - `Select`, `SelectContent`, `SelectItem` - Service and time selection
  - `Calendar`, `Popover` - Date selection interface
  - `Button` - Primary and secondary actions
  - `Alert` - Error states and informational messages
  - `Skeleton` - Loading states

#### Layout Components
- **BookingPage** (`/src/app/(booking)/page.tsx`)
  - Main page layout with hero section and sidebar
  - Trust indicators and practice information
  - Booking tips and security assurances
  - Responsive grid layout (2:1 ratio on desktop)

### 5. Data Schema & Interaction Layer

#### Convex Database Schema
```typescript
// Core booking entity
bookings: {
  userId: Id<"users">,           // References authenticated user
  serviceType: string,           // Service type identifier
  date: number,                  // Unix timestamp for appointment
  time: string,                  // Time slot (e.g., "09:00")
  status: "pending" | "confirmed" | "cancelled" | "completed",
  notes?: string,                // Optional patient notes
  createdAt: number,             // Booking creation timestamp
  updatedAt: number,             // Last update timestamp
}
```

#### Client-Side Data Flow
- **Authentication:** Clerk integration with automatic user sync to Convex
- **Form State:** React Hook Form with Zod schema validation
- **Real-time Updates:** Convex reactive queries for booking status
- **Error Handling:** Comprehensive error states with user-friendly messages
- **Loading States:** Skeleton UIs and optimistic updates

#### API Integration Points
- **useCreateBooking:** Convex mutation for creating new bookings
- **useUserBookings:** Reactive query for user's booking history
- **useCurrentUser:** Authenticated user data with loading states
- **Booking Status Flow:** pending → confirmed → completed/cancelled

#### Form Validation Schema
```typescript
const bookingFormSchema = z.object({
  serviceType: z.enum([
    "initial-consultation",
    "regular-adjustment",
    "extended-comprehensive"
  ]),
  date: z.date().refine(date => date > new Date(), {
    message: "Date must be in the future"
  }),
  time: z.string().min(1, "Time is required"),
  notes: z.string().optional()
});
```

### 6. System Feedback & Microinteractions

#### Success States
- **Booking Confirmation:** Green checkmark with comprehensive details
- **Form Validation:** Real-time inline validation with positive reinforcement
- **Service Selection:** Immediate feedback with pricing and duration updates
- **Calendar Navigation:** Smooth transitions between months with focus management

#### Error States
- **Validation Errors:** Contextual error messages with specific guidance
- **Network Failures:** Retry mechanisms with offline fallback options
- **Booking Conflicts:** Clear messaging with alternative suggestions
- **Authentication Errors:** Clear call-to-action to sign in or create account

#### Loading States
- **Form Submission:** Loading spinner with disabled form fields
- **Calendar Navigation:** Skeleton states during month transitions
- **Data Fetching:** Progressive loading with skeleton UI components
- **Confirmation Page:** Loading state while fetching booking details

#### Microinteractions
- **Hover States:** Visual feedback on interactive elements
- **Focus Management:** Logical tab order with visible focus indicators
- **Button States:** Loading, disabled, and success states with clear visual distinction
- **Calendar Density:** Visual indicators showing appointment availability

### 7. Recommendations for Implementation

#### Component Structure
```typescript
/src/app/(booking)/page.tsx          // Main booking page layout
/src/components/features/booking/    // Booking-specific components
  ├── booking-form.tsx              // Main booking form
  ├── booking-calendar.tsx          // Interactive calendar
  ├── booking-confirmation.tsx      // Post-booking display
  ├── booking-status-badge.tsx      // Status indicator component
  └── types.ts                      // TypeScript definitions
/src/lib/convex/client.ts           // Data layer hooks
/convex/bookings.ts                 // Database operations
```

#### Implementation Priorities
1. **Phase 1:** Core booking functionality with service selection and basic form
2. **Phase 2:** Enhanced calendar with availability indicators
3. **Phase 3:** Booking confirmation and status management
4. **Phase 4:** Advanced features like booking history and rescheduling

#### MCP Integration Opportunities
- **Calendar Enhancement:** Use OriginUI calendar components for advanced features
- **Form Validation:** Leverage Zod schemas with ShadCN form components
- **Data Display:** Implement data tables for booking history management

#### Accessibility Implementation
- **Keyboard Navigation:** Full keyboard accessibility for all interactive elements
- **Screen Reader Support:** Comprehensive ARIA labels and descriptions
- **Focus Management:** Logical focus flow and visible focus indicators
- **Color Contrast:** WCAG 2.1 AA compliant color combinations

### 8. Performance Requirements

#### Core Web Vitals
- **LCP (Largest Contentful Paint):** < 2.5s for above-the-fold content
- **FID (First Input Delay):** < 100ms for interactive elements
- **CLS (Cumulative Layout Shift):** < 0.1 for visual stability

#### Loading Performance
- **Initial Load:** < 2 seconds for first contentful paint
- **Interactive Ready:** < 3 seconds for full booking functionality
- **Calendar Loading:** < 1 second for availability data
- **Form Submission:** < 500ms for booking confirmation response

#### Bundle Optimization
- **Code Splitting:** Lazy load non-critical booking components
- **Image Optimization:** Compressed practice images and icons
- **Font Loading:** Efficient font loading strategies
- **Third-party Scripts:** Minimal impact on core functionality

### 9. Future Extensibility

#### Planned Enhancements
- **Multi-Location Support:** Book appointments at different practice locations
- **Practitioner Selection:** Choose specific chiropractors or specialists
- **Insurance Integration:** Real-time insurance verification and coverage display
- **Telehealth Booking:** Virtual consultation scheduling options
- **Advanced Scheduling:** Recurring appointments and treatment plans

#### Scalability Considerations
- **Database Optimization:** Efficient indexing for high-volume booking data
- **Caching Strategy:** Intelligent caching for availability and scheduling data
- **API Rate Limiting:** Protect against abuse while maintaining usability
- **Real-time Updates:** WebSocket integration for live availability updates

#### Integration Opportunities
- **Calendar Sync:** Google Calendar, Outlook, and Apple Calendar integration
- **Payment Processing:** Online payment collection and insurance co-pays
- **Patient Portal:** Extended patient management features
- **Analytics Dashboard:** Booking metrics and practice insights

### 10. Handoff Notes

#### Development Guidelines
- **Component Library:** Consistent use of ShadCN UI components with custom variants
- **State Management:** React hooks with Convex for real-time data sync
- **Error Boundaries:** Comprehensive error handling with user-friendly messages
- **Testing Strategy:** Unit tests for components, integration tests for booking flow

#### Deployment Considerations
- **Environment Variables:** Secure handling of API keys and configuration
- **Database Migrations:** Controlled schema evolution with Convex
- **Performance Monitoring:** Core Web Vitals tracking and optimization
- **Analytics Implementation:** Booking funnel and conversion tracking

#### Maintenance Notes
- **Content Updates:** Practice information and service descriptions may change
- **Seasonal Adjustments:** Holiday hours and temporary availability changes
- **Feature Enhancements:** Regular updates based on user feedback and analytics
- **Security Updates:** Regular dependency updates and security patches

#### Testing Checklist
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS, Android, various screen sizes)
- [ ] Accessibility testing (screen readers, keyboard navigation)
- [ ] Form validation edge cases and error scenarios
- [ ] Network failure handling and offline functionality
- [ ] Performance testing under load conditions

---

*This specification follows the Next.js 16 + ShadCN UI template structure and is designed for implementation with modern web technologies including Convex for real-time data, Clerk for authentication, and React Hook Form for form management. All components prioritize accessibility, performance, and user experience for chiropractic patients.*