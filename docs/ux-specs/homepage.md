# Homepage UX Specification
## Dr Tim Foo Chiropractic Practice

### 1. Overview

**Page Purpose:** The homepage serves as the primary introduction to Dr Tim Foo's chiropractic practice, focusing on building trust, showcasing compassionate care, and driving prospective patients to connect with the practice through various channels.

**Primary User Goals:**
- Understand Dr Tim Foo's approach to chiropractic care
- Learn about the conditions treated and services offered
- Read patient testimonials and social proof
- Connect with the practice for consultation or booking
- Feel confident about choosing the practice for their healthcare needs

**Business Objectives:**
- Build trust through authentic, empathetic messaging
- Showcase the practice's expertise and patient-centered approach
- Convert website visitors into engaged prospects
- Provide multiple pathways for patient connection (booking, chat, contact)
- Establish the practice as a trusted healthcare provider in Singapore

### 2. User Journey Mapping

#### Stage 1: Personal Connection & Trust Building
- **Objective:** User connects with Dr Tim Foo's personal approach to care and feels welcomed
- **Entry Point:** Direct URL `/`, search engines, referrals, or social media
- **Key Actions:**
  - Read the warm, personal greeting "Hello, Your journey starts here"
  - Understand the empathetic approach to patient concerns
  - Review practice credentials and "State Of Flow" identity - it is the chiropractic practice started by Dr. Tim Foo.
  - See social proof through ratings and patient count
- **Data Inputs:** User intent (new/existing), trust indicators, practice information
- **Data Outputs:** Trust establishment, practice understanding, confidence building
- **UX Notes:** Personal, caring tone reduces patient anxiety; immediate social proof builds credibility
- **Tech Hooks:** Social proof integration, rating display, practice credential components

#### Stage 2: Education & Service Discovery
- **Objective:** User learns about conditions treated and practice capabilities to make informed decisions
- **Entry Point:** Scrolling through the homepage content after initial connection
- **Key Actions:**
  - Read about "Thousands of Proactive Singaporeans" choosing natural therapies
  - Review comprehensive list of treated conditions (spinal, extremity, gastrointestinal)
  - Understand the holistic approach to musculoskeletal health
  - See the emphasis on word-of-mouth referrals and trust
- **Data Inputs:** Service categories, condition information, treatment approaches
- **Data Outputs:** Service understanding, condition relevance, treatment options
- **UX Notes:** Educational content builds confidence; comprehensive condition listings show expertise
- **Tech Hooks:** Service card components, condition categorization, content hierarchy

#### Stage 3: Social Proof & Trust Validation
- **Objective:** User validates the practice quality through patient experiences and builds confidence
- **Entry Point:** Testimonials section and social proof elements
- **Key Actions:**
  - Read authentic patient testimonials with specific conditions and outcomes
  - Review Facebook ratings (5.0 stars, 17 reviews)
  - See real patient names and dates for authenticity
  - Understand immediate relief and professional service quality
- **Data Inputs:** Patient testimonials, ratings, review counts, patient outcomes
- **Data Outputs:** Trust validation, outcome expectations, practice quality assessment
- **UX Notes:** Real patient stories with specific outcomes build credibility; authentic names and dates increase trust
- **Tech Hooks:** Facebook review integration, testimonial components, rating display system

#### Stage 4: Connection & Action
- **Objective:** User takes action to connect with the practice through preferred channel
- **Entry Point:** Multiple call-to-action opportunities throughout the page
- **Key Actions:**
  - Click "Book Now" to access the booking system
  - Use "Chat with Us" for Facebook Messenger connection
  - Choose "Have a Question" for general inquiry
  - Visit Facebook reviews for additional validation
- **Data Inputs:** CTA selection, preferred contact method, urgency level
- **Data Outputs:** Practice engagement, appointment booking, connection establishment
- **UX Notes:** Multiple connection options accommodate different user preferences; clear CTAs reduce friction
- **Tech Hooks:** CTA tracking, Facebook Messenger integration, booking system navigation, contact form routing

### 2.5. Personalization Framework (Phase 2)

#### Personalization Layers
| Layer | Trigger | Personalization | Impact |
|-------|---------|----------------|---------|
| **Returning Visitors** | Browser/localStorage | Skip intro, show booking history | Reduced friction |
| **Referral Source** | UTM parameters | Customize messaging based on entry point | Contextual relevance |
| **Condition-Specific** | URL parameters or search | Deep link to relevant service cards | Faster decision making |
| **Time-Sensitive** | Real-time availability | Adjust urgency messaging | Increased conversion |
| **Geographic** | IP location | Singapore-specific content | Local relevance |

#### Personalization Implementation
```typescript
// Example personalization logic
const personalization = {
  returningVisitor: {
    skipHero: true,
    showQuickBook: true,
    customGreeting: "Welcome back!"
  },
  referralSource: {
    google: "SEO-optimized messaging",
    facebook: "Social proof emphasis",
    referral: "Trust and credibility focus"
  },
  conditionFocus: {
    back_pain: "Highlight spinal services",
    sports_injury: "Emphasize sports therapy",
    general_wellness: "Show preventive care"
  }
}
```

#### Privacy-First Personalization
- **Cookie-less Approach:** Use localStorage and session data
- **GDPR/PDPA Compliance:** Clear consent for personalization
- **Opt-out Options:** Easy deactivation of personalized features
- **Data Minimization:** Collect only essential personalization data

### 3. Responsive Behavior & Progressive Enhancement

#### Progressive Enhancement Strategy
- **No-JS Baseline:** Essential content (services, testimonials, contact info) accessible without JavaScript
- **Enhanced Experience:** Interactive elements (hover states, animations) layer on top
- **Offline-First:** Service worker consideration for return visitors
- **Connection-Aware:** Reduce animations on slow connections
- **Core User Flow:** Book appointment → View services → Read testimonials → Contact practice

#### Mobile (< 768px)
- **Layout:** Single column stack with prominent CTAs
- **Navigation:** Easy scrolling through content sections
- **Touch Targets:** Large, accessible buttons and links
- **Content:** Prioritized messaging with clear value propositions
- **Performance:** Optimized for quick loading and smooth scrolling
- **Mobile-Specific Interactions:**
  - Sticky CTA Bar: Fixed bottom bar with primary action on scroll
  - Swipeable Testimonials: Native carousel on mobile
  - Click-to-Call: Direct phone call button (not just booking)
  - WhatsApp Integration: Popular in Singapore healthcare
  - Haptic Feedback: Subtle vibration on CTA press (where supported)
  - Pull-to-Refresh: For returning visitors checking availability

#### Tablet (768px - 1024px)
- **Layout:** Balanced layout with improved content density
- **Interaction:** Touch-optimized with enhanced visual hierarchy
- **Content:** Better utilization of screen real estate
- **Navigation:** Improved section visibility and access

#### Desktop (> 1024px)
- **Layout:** Full-width layout with optimal content spacing
- **Interaction:** Enhanced hover states and visual feedback
- **Content:** Maximum readability and engagement
- **Professional Presentation:** Polished appearance for desktop users

### 4. UI Component Architecture

#### Component Group: Hero & Personal Connection
- **Primary Components:**
  - **HeroSection:** Personal greeting with "Hello," message and practice branding
  - **TrustIndicators:** Ratings, patient count, and social proof elements
  - **PrimaryCTAs:** Book Now and Chat with Us action buttons
  - **EnhancedTrustSignals:** Professional credentials, privacy badges, real-time availability
- **UI States:**
  - Default: Personal greeting with trust indicators
  - Hover: Enhanced button states and social proof highlights
  - Loading: Content reveal animations
  - Success: CTA confirmation feedback
- **ShadCN Pattern Used:** `card`, `button`, `badge`
- **MCP Pattern Reference:** `hero-welcome`, `trust-indicators`, `social-proof`
- **Interactivity:** Button clicks, hover effects, scroll triggers
- **Accessibility Notes:** Screen reader announcements for greeting; clear focus management for CTAs; high contrast ratios for readability
- **Micro-Frontend Considerations:**
  - **Independent Deployment:** Trust indicators can update without full page reload
  - **A/B Testing:** Multiple CTA variants testable separately
  - **Real-Time Updates:** Availability status syncs with booking system

#### Component Group: Services & Education
- **Primary Components:**
  - **WelcomeMessage:** Community-focused messaging about proactive Singaporeans
  - **ServicesCards:** Condition categories (Spinal, Extremity, Other) with detailed listings
  - **ServiceIcons:** Visual indicators for different service categories
- **UI States:**
  - Default: Service cards with condition listings
  - Interactive: Card hover effects with elevation changes
  - Loading: Progressive content reveal
  - Empty: No content state for missing information
- **ShadCN Pattern Used:** `card`, `cardheader`, `cardcontent`
- **MCP Pattern Reference:** `service-cards`, `condition-listings`, `educational-content`
- **Interactivity:** Card hover, smooth scrolling to sections, content filtering
- **Accessibility Notes:** Semantic HTML structure; keyboard navigation through service cards; clear headings hierarchy

#### Component Group: Social Proof & Testimonials
- **Primary Components:**
  - **TestimonialsSection:** Real patient stories with names, dates, and outcomes
  - **FacebookReviews:** Star ratings and review integration
  - **SocialProofBadges:** Review counts and rating displays
- **UI States:**
  - Default: Testimonial cards with patient information
  - Interactive: Hover effects on review elements
  - Loading: Staggered testimonial reveal
  - Error: Fallback for missing review data
- **ShadCN Pattern Used:** `card`, `badge`, `button`
- **MCP Pattern Reference:** `testimonials-carousel`, `social-proof`, `facebook-integration`
- **Interactivity:** External link navigation, review filtering, testimonial expansion
- **Accessibility Notes:** Real names and dates for authenticity; external link indicators; keyboard navigation through testimonials

#### Component Group: Conversion & Connection
- **Primary Components:**
  - **CTASection:** Final conversion prompts with multiple action options
  - **FacebookMessenger:** Direct chat integration button
  - **ContactOptions:** Multiple pathways for patient engagement
- **UI States:**
  - Default: Multiple CTA buttons with clear labels
  - Hover: Enhanced button states with visual feedback
  - Loading: Button processing states
  - Success: Connection confirmation feedback
- **ShadCN Pattern Used:** `button`, `card`, `badge`
- **MCP Pattern Reference:** `conversion-ctas`, `messenger-integration`, `contact-options`
- **Interactivity:** Button clicks, external navigation, form triggers
- **Accessibility Notes:** Clear button labels; external link indicators; keyboard accessibility for all CTAs

### 5. Data Schema & Interaction Layer

| Field | Type | Source | Used In | Validation |
|--------|------|---------|---------|-------------|
| testimonials | object[] | Static content | TestimonialsSection | Required |
| testimonial.name | string | Static content | TestimonialsSection | Required |
| testimonial.date | string | Static content | TestimonialsSection | Required |
| testimonial.content | string | Static content | TestimonialsSection | Required |
| testimonial.rating | number | Static content | TestimonialsSection | Required (1-5) |
| testimonial.source | string | Static content | TestimonialsSection | Required |
| serviceCategories | object[] | Static content | ServicesCards | Required |
| service.title | string | Static content | ServicesCards | Required |
| service.description | string | Static content | ServicesCards | Required |
| service.conditions | string[] | Static content | ServicesCards | Required |
| socialProof | object | Static content | HeroSection | Required |
| socialProof.rating | number | Static content | HeroSection | Required (1-5) |
| socialProof.reviewCount | number | Static content | HeroSection | Required |
| socialProof.patientCount | string | Static content | HeroSection | Required |
| ctaTracking | object | User interaction | Analytics | Optional |
| ctaTracking.clickSource | string | User interaction | Analytics | Optional |
| ctaTracking.timestamp | number | User interaction | Analytics | Optional |

> 🧠 All patient testimonial data is authentic and used with patient consent. Social proof metrics are synchronized with Facebook review data.

### 5.5. Conversion Analytics & Optimization

#### Core Conversion Metrics
| Metric | Tracking Method | Success Criteria | Measurement Point |
|--------|----------------|------------------|-------------------|
| Hero CTA Click-Through | Event tracking | >8% CTR | Hero section interactions |
| Scroll Depth | Scroll tracking | >60% reach testimonials | Section visibility |
| Testimonial Engagement | Time on section | >10s average | Testimonials section |
| Multi-CTA Attribution | Last-click + assisted | Track conversion paths | All CTA interactions |
| Form Abandonment | Field-level tracking | <30% abandonment | Booking form steps |
| Social Proof Impact | A/B test variants | Measure lift | Review elements |
| Mobile CTA Performance | Mobile-specific events | >12% mobile CTR | Sticky bar interactions |
| Page Load Performance | Core Web Vitals | LCP < 2.5s | Performance metrics |

#### Conversion Funnel Analysis
```
Homepage Visit → Hero Engagement → Service Discovery →
Social Proof Review → CTA Selection → Booking Initiation →
Form Completion → Appointment Confirmation
```

#### A/B Testing Framework
- **Hero Variants:** Different messaging approaches (professional vs. personal)
- **CTA Testing:** Button colors, text, placement variations
- **Testimonial Formats:** Card layout vs. carousel presentation
- **Trust Signals:** Social proof placement and prominence
- **Mobile Optimization:** Sticky bar vs. inline CTAs

#### Attribution Models
- **Last Click:** Final conversion touchpoint
- **Linear Attribution:** Equal credit to all interactions
- **Time Decay:** Recent interactions weighted more heavily
- **Position Based:** First and last touchpoints receive 40% each, middle 20%

### 6. System Feedback & Modern Microinteractions

#### Modern Animation Stack
- **View Transitions API:** SPA-like navigation (when supported)
- **Intersection Observer:** Trigger animations on viewport entry
- **Reduced Motion:** Respect prefers-reduced-motion media query
- **Scroll-Linked Animations:** Subtle parallax on hero section
- **Spring Physics:** Natural easing (CSS spring() or Framer Motion)

#### Animation System
| State | Style | Duration | Modern Implementation | UX Behavior |
|--------|--------|-----------|---------------------|--------------|
| **CTA Hover** | Blue background with white text | Instant | CSS transitions + haptic feedback | Visual + tactile feedback |
| **Card Hover** | Subtle elevation with shadow transition | 200ms | CSS transforms + spring physics | Natural elevation effect |
| **Button Click** | Scale transform with ripple effect | 150ms | Web Animations API + spring easing | Satisfying confirmation |
| **Content Reveal** | Fade-in with upward slide | 600ms | Intersection Observer + stagger | Progressive loading |
| **Social Proof** | Animated star rating display | 800ms | Count-up animation + CSS springs | Trust-building emphasis |
| **View Transitions** | Cross-page animations | 300ms | View Transitions API | SPA-like navigation |
| **Scroll Parallax** | Subtle background movement | Scroll-based | Scroll-driven animations | Depth and engagement |
| **Loading State** | Skeleton with pulse animation | 2-3s | CSS skeleton screens + shimmer | Professional loading |
| **Error State** | Red outline with shake animation | 500ms | CSS keyframes + spring physics | Clear error indication |
| **Success State** | Green checkmark with confetti | 2s | Canvas particles + CSS animations | Delightful feedback |

#### Performance-Optimized Animations
```css
/* GPU-accelerated animations */
.animate-gpu {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU layer */
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Spring physics for natural feel */
.spring-enter {
  animation: springEnter 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes springEnter {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

### 7. Recommendations for Implementation

#### Component Importing
Use ShadCN UI components with custom variants for chiropractic practice:
```bash
# Core homepage components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

# Social media integration
import { FacebookButton } from "@/components/ui/facebook-button"
import { MessengerButton } from "@/components/ui/messenger-button"
```

#### Chiropractic-Specific Best Practices
- **Patient Privacy:** All testimonials used with explicit patient consent
- **Trust Building:** Authentic names and dates for credibility
- **Professional Tone:** Balance warmth with chiropractic professionalism
- **Multiple Contact Options:** Provide various ways for patients to connect


#### Folder Structure (Next.js 16)
```
/app
  /page.tsx                 # Homepage with personal connection focus
  /layout.tsx               # Root layout with practice branding
/components
  /features/homepage/       # Homepage-specific components
    /hero-section.tsx       # Personal greeting and trust indicators
    /service-cards.tsx      # Condition categories with @coss/card
    /testimonials.tsx       # Enhanced testimonials with @magicui/magic-card
    /cta-section.tsx        # Conversion elements with @magicui/shimmer-button
  /ui/                     # Registry-based components (@coss + @magicui)
    /@coss/
      button.tsx           # Professional chiropractic CTAs
      card.tsx             # Service and testimonial containers
      badge.tsx            # Trust indicators and ratings
      form.tsx             # Contact and booking forms
    /@magicui/
      magic-card.tsx       # Spotlight testimonials for trust
      shimmer-button.tsx   # Enhanced primary CTAs
  /social/                # Social media integration
    /facebook-button.tsx   # Facebook review integration
    /messenger-button.tsx  # Direct chat functionality
```

#### Integration Best Practices
- Use semantic HTML for chiropractic accessibility compliance
- Implement proper ARIA labels for screen readers
- Add conversion tracking for patient journey analytics
- Maintain Facebook API integration for real-time reviews
- Ensure WCAG 2.1 AA compliance throughout all interactions

### 7.6. ShadCN Registry Component Strategy

#### Recommended Registry Options
Based on comprehensive evaluation of available registries for chiropractic applications, three strategic approaches are recommended:

---

### **Option 1: Professional Foundation (@coss + @magicui)**
**Primary Registry: @coss (70% of components)**
- **Why Optimal:** Complete component coverage with chiropractic-appropriate professional design
- **Key Components:** `card`, `button`, `badge`, `form` - all essential UI elements
- **Benefits:** Stable dependencies, clean aesthetics, reliable performance

**Secondary Registry: @magicui (30% of components)**
- **Why Complementary:** Enhanced trust-building and conversion elements
- **Key Components:** `magic-card` (spotlight testimonials), `shimmer-button` (primary CTAs)
- **Benefits:** Subtle animations that enhance without distracting from chiropractic professionalism

#### Component Implementation Matrix (@coss + @magicui)
| Homepage Component | Registry | Purpose | Chiropractic Alignment |
|-------------------|-----------|---------|---------------------|
| **Service Cards** | @coss | Clean service presentation | ✅ Professional, trustworthy |
| **CTA Buttons** | @coss + @magicui | Professional + enhanced conversion | ✅ Balanced approach |
| **Testimonials** | @coss + @magicui | Clean base + spotlight trust effect | ✅ Enhanced credibility |
| **Trust Badges** | @coss | Simple, clear indicators | ✅ Chiropractic appropriate |
| **Contact Forms** | @coss | Complete form solution | ✅ Professional chiropractic forms |

#### Installation Commands (@coss + @magicui)
```bash
# Phase 1: Core Professional Components (@coss)
bunx shadcn@latest add @coss/card @coss/button @coss/badge @coss/form

# Phase 2: Enhanced Trust Elements (@magicui)
bunx shadcn@latest add @magicui/magic-card @magicui/shimmer-button
```

---

### **Option 2: Comprehensive Component Library (@reui)**
**Primary Registry: @reui (100% of components)**
- **Why Optimal:** Extensive component library (687 components) with professional healthcare-appropriate design
- **Key Components:** `card`, `button`, `badge`, `statistic-card-*`, `accordion-default`, `alert-default`
- **Benefits:** Comprehensive coverage, consistent design system, professional healthcare aesthetics

#### Component Implementation Matrix (@reui)
| Homepage Component | Registry Component | Purpose | Chiropractic Alignment |
|-------------------|-------------------|---------|---------------------|
| **Service Cards** | `@reui/card`, `@reui/card-default` | Professional service presentation | ✅ Healthcare appropriate |
| **CTA Buttons** | `@reui/button`, `@reui/button-icon` | Multiple CTA variants with social integration | ✅ Professional conversion |
| **Trust Indicators** | `@reui/badge`, `@reui/alert-default` | Ratings, review counts, trust signals | ✅ Credibility building |
| **Testimonials** | `@reui/hover-card`, `@reui/card-accent` | Interactive testimonial display | ✅ Enhanced patient trust |
| **Service Categories** | `@reui/accordion-default` | Expandable condition listings | ✅ Organized presentation |
| **Patient Metrics** | `@reui/statistic-card-1` through `statistic-card-15` | Professional outcomes display | ✅ Data-driven trust |
| **Contact Forms** | `@reui/input-form`, `@reui/base-input-form` | Professional inquiry forms | ✅ Healthcare forms |
| **Social Media CTAs** | `@reui/button-icon`, `@reui/button-badge` | Facebook, WhatsApp integration | ✅ Multi-channel connection |

#### Installation Commands (@reui)
```bash
# Core Homepage Components
bunx shadcn@latest add @reui/card @reui/button @reui/badge

# Trust and Social Proof Elements
bunx shadcn@latest add @reui/statistic-card-1 @reui/hover-card @reui/alert-default

# Interactive Service Elements
bunx shadcn@latest add @reui/accordion-default @reui/card-accent

# Enhanced CTAs and Forms
bunx shadcn@latest add @reui/button-icon @reui/input-form @reui/button-badge

# Data Visualization (Optional for Phase 2)
bunx shadcn@latest add @reui/area-chart-1 @reui/line-chart-1
```

---

### **Option 3: Hybrid Approach (@reui + @magicui)**
**Primary Registry: @reui (80% of components)**
- Professional foundation with extensive component variety

**Enhancement Registry: @magicui (20% of components)**
- **Key Components:** `magic-card` for spotlight testimonials, `shimmer-button` for primary CTAs
- **Purpose:** Subtle trust-building enhancements to the comprehensive @reui foundation

#### Installation Commands (Hybrid)
```bash
# Foundation: @reui comprehensive library
bunx shadcn@latest add @reui/card @reui/button @reui/badge @reui/statistic-card-1
bunx shadcn@latest add @reui/accordion-default @reui/hover-card @reui/input-form

# Enhancements: @magicui trust elements
bunx shadcn@latest add @magicui/magic-card @magicui/shimmer-button
```

---

#### Registry Compatibility Assessment
- **@coss:** ✅ Perfect chiropractic alignment - professional, clean, accessible
- **@magicui:** ✅ Complementary enhancements - subtle trust-building effects
- **@reui:** ✅ Excellent healthcare alignment - professional, comprehensive, trustworthy
- **@aceternity:** ❌ Not suitable - overly complex animations, distracts from chiropractic trust
- **Other Registries:** ⚠️ Limited chiropractic relevance or excessive complexity

#### Recommendation Summary
| Approach | Best For | Complexity | Maintenance | Trust Building |
|----------|-----------|------------|-------------|----------------|
| **@coss + @magicui** | Minimal, focused design | Low | Excellent | High |
| **@reui Only** | Comprehensive feature set | Medium | Good | Very High |
| **@reui + @magicui** | Maximum trust and features | Medium-High | Good | Excellent |

#### Implementation Benefits
- **Professional Trust:** Clean chiropractic-appropriate design language across all options
- **Conversion Optimization:** Enhanced CTAs that drive appointment bookings
- **Accessibility:** WCAG-compliant components with chiropractic focus
- **Performance:** Optimized for chiropractic website standards
- **Maintainability:** Stable, well-documented component libraries
- **Future-Proof:** All options support extensibility and growth

### 7.5. SEO & Structured Data Framework

#### Schema.org Markup Implementation
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalBusiness",
      "medicineSystem": "https://schema.org/Chiropractic",
      "name": "Dr Tim Foo Chiropractic Practice",
      "description": "Professional chiropractic services in Singapore",
      "url": "https://drtimfoo.com",
      "telephone": "+65-8112-3506",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "SG",
        "addressLocality": "Singapore"
      },
      "openingHours": "By appointments only",
      "specialty": "Chiropractic Care"
    },
    {
      "@type": "AggregateRating",
      "itemReviewed": {
        "@type": "MedicalBusiness",
        "name": "Dr Tim Foo Chiropractic Practice"
      },
      "ratingValue": "5.0",
      "reviewCount": "17",
      "bestRating": "5"
    },
    {
      "@type": "Service",
      "name": "Spinal Adjustment",
      "description": "Professional spinal alignment services",
      "provider": {
        "@type": "MedicalBusiness",
        "medicineSystem": "https://schema.org/Chiropractic",
        "name": "Dr Tim Foo Chiropractic Practice"
      }
    }
  ]
}
```

#### Chiropractic-Specific SEO Elements
| Element | Implementation | Impact |
|---------|----------------|---------|
| **LocalBusiness Schema** | Practice info, location, hours | Local search visibility |
| **MedicalBusiness Schema** | Chiropractic-specific properties | Industry relevance |
| **Review Aggregation** | Structured testimonial data | Rich snippets in search |
| **FAQPage Schema** | Common patient questions | Featured snippets |
| **Service Schema** | Individual condition treatments | Service-specific visibility |
| **BreadcrumbList** | Navigation hierarchy | Search context |

#### Content Hierarchy for SEO
```html
<!-- Semantic HTML5 structure -->
<main>
  <section id="hero">
    <h1>Dr Tim Foo Chiropractic Practice - Singapore</h1>
    <p>Professional chiropractic care for optimal health</p>
  </section>

  <section id="services">
    <h2>Chiropractic Services & Conditions Treated</h2>
    <article>
      <h3>Spinal Adjustment & Alignment</h3>
    </article>
  </section>

  <section id="testimonials">
    <h2>Patient Success Stories & Reviews</h2>
    <blockquote>
      <p>Immediate relief after first session...</p>
      <cite>John Tan, January 2024</cite>
    </blockquote>
  </section>
</main>
```

#### Meta Tags & Social Sharing
```html
<!-- Essential meta tags -->
<meta name="description" content="Dr Tim Foo Chiropractic Practice - Professional chiropractic services in Singapore. 5.0 stars from 17 reviews. Book your appointment today.">
<meta name="keywords" content="chiropractor Singapore, spinal adjustment, back pain treatment">

<!-- Open Graph for social sharing -->
<meta property="og:title" content="Dr Tim Foo Chiropractic Practice">
<meta property="og:description" content="Professional chiropractic care with 5.0 star rating">
<meta property="og:image" content="/images/practice-social.jpg">
<meta property="og:url" content="https://drtimfoo.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Dr Tim Foo Chiropractic Practice">
```

#### Technical SEO Considerations
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Mobile-First Indexing:** Responsive design prioritized
- **Site Speed:** Optimized images, minimal JavaScript, CDN usage
- **Internal Linking:** Service pages, testimonials, contact information
- **External Authority:** Facebook reviews, healthcare directories

### 8. Performance Requirements

#### Core Web Vitals
- **LCP (Largest Contentful Paint):** < 2.5s for hero content
- **FID (First Input Delay):** < 100ms for interactive elements
- **CLS (Cumulative Layout Shift):** < 0.1 for visual stability

#### Loading Performance
- **Initial Load:** < 2 seconds for first contentful paint
- **Interactive Ready:** < 3 seconds for full page functionality
- **CTA Response:** < 100ms for button interactions
- **External Links:** Fast social media integration

### 8.5. Comprehensive Error Handling & Edge Cases

#### Error Scenario Matrix
| Error Scenario | User Message | Recovery Action | Technical Implementation |
|----------------|--------------|-----------------|-------------------------|
| **Facebook API Down** | "Reviews temporarily unavailable - showing cached patient stories" | Display cached testimonials + manual refresh option | Fallback data + retry mechanism |
| **Booking System Offline** | "Online booking temporarily unavailable - call us directly at +65-XXXX-XXXX" | Click-to-call button + WhatsApp contact | Service worker offline detection |
| **Slow Connection** | "Loading your content... (optimized for your connection)" | Progressive skeleton UI + reduced animations | Network API detection + adaptive loading |
| **Form Validation Error** | Inline, specific error messages per field | Clear correction guidance with examples | React Hook Form + Zod validation |
| **404 Service Page** | "Let's find what you need - search below or call us" | Search functionality + popular services link | Custom 404 component + helpful navigation |
| **Geolocation Blocked** | "Showing general Singapore pricing - enable location for specific rates" | Continue with default content | Fallback content without geolocation |
| **LocalStorage Full** | "Browser storage full - some features may be limited" | Clear cache option + session-based fallback | Storage quota detection + cleanup |
| **JavaScript Disabled** | "Enhanced features unavailable - core content accessible below" | Fallback to static content | Progressive enhancement baseline |
| **Image Load Failure** | "Practice photo unavailable - showing practice information" | Alt text + retry button | Error boundaries + fallback UI |

#### Error Recovery Patterns
```typescript
// Example error boundary implementation
class HomepageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to monitoring service
    console.error('Homepage error:', { error, errorInfo });

    // Track error for analytics
    if (window.gtag) {
      gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>We're working to fix this. Please try:</p>
          <ul>
            <li>Refreshing the page</li>
            <li>Calling us directly</li>
            <li>Using our chat service</li>
          </ul>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Graceful Degradation Strategy
- **Core Content Always Available:** Services, contact info, testimonials without JS
- **Enhanced Features Gracefully Fail:** Animations, real-time updates, social proof
- **Multiple Contact Pathways:** Booking form → Phone → WhatsApp → Email
- **Offline Functionality:** Cached content + service worker for return visitors
- **Error Tracking:** Comprehensive monitoring with user-friendly messages

#### Network Resilience
```javascript
// Network-aware loading strategy
const networkAwareLoading = {
  // Detect connection quality
  getConnectionType: () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection ? connection.effectiveType : '4g';
  },

  // Adaptive content loading
  loadContent: async (connectionType) => {
    const loadingStrategy = {
      'slow-2g': { images: false, animations: false, videos: false },
      '2g': { images: 'low-quality', animations: false, videos: false },
      '3g': { images: 'medium-quality', animations: 'reduced', videos: false },
      '4g': { images: 'high-quality', animations: 'full', videos: true }
    };

    return loadingStrategy[connectionType] || loadingStrategy['4g'];
  }
};
```

#### Bundle Optimization
- **Component Optimization:** Efficient import and usage patterns
- **Image Optimization:** WebP format with responsive loading
- **Font Loading:** Strategic font loading for readability
- **Social Media:** Optimized external link integration

### 9. Future Extensibility

| Layer | Direction | Example Extension |
|--------|------------|------------------|
| **UI** | Enhanced Patient Features | Video testimonials, virtual practice tour |
| **Logic** | Social Media Integration | Instagram testimonials, Google reviews |
| **Data** | Patient Analytics | Conversion tracking, patient journey analysis |
| **Communication** | Patient Engagement | Newsletter signup, educational content |
| **Accessibility** | Advanced Features | Multilingual support, voice navigation |

### 10. Handoff Notes

#### Chiropractic UX Export Structure
```
Homepage > [Stage] > [Component Group]
├── Personal Connection & Trust Building
│   ├── Hero Section
│   └── Trust Indicators
├── Education & Service Discovery
│   ├── Welcome Message
│   └── Services Cards
├── Social Proof & Trust Validation
│   ├── Testimonials Section
│   └── Facebook Reviews
└── Connection & Action
    ├── CTA Section
    └── Social Media Integration
```

#### Chiropractic Interaction Annotations
Every patient interaction element should include:
- `[action]` → `[feedback]` mapping with patient experience impact
- `[state]` → `[transition]` details with accessibility considerations
- **Chiropractic compliance** requirements for patient privacy
- **Trust building** impact assessments

#### Chiropractic Development Handoff Checklist
- [ ] All patient testimonials are used with explicit consent
- [ ] Social proof integration maintains real-time synchronization
- [ ] Error messages are patient-friendly and helpful
- [ ] Loading states maintain professional chiropractic presentation
- [ ] Mobile responsiveness tested for various patient devices
- [ ] Performance optimization meets chiropractic expectations
- [ ] Cross-browser compatibility verified
- [ ] Facebook integration tested and functional
- [ ] Accessibility testing completed with chiropractic focus
- [ ] Content accuracy verified for all service information

#### ShadCN Registry Implementation Checklist
- [ ] @coss registry installed and configured for core components
- [ ] @magicui registry installed for enhanced trust elements
- [ ] Component dependencies resolved (@base-ui-components/react, motion)
- [ ] Professional chiropractic styling maintained across all components
- [ ] Enhanced elements (magic-card, shimmer-button) used sparingly for trust
- [ ] Component variations created for chiropractic-specific use cases
- [ ] Animation settings optimized for chiropractic accessibility
- [ ] Performance testing completed with combined registry components
- [ ] Cross-component compatibility verified (@coss + @magicui integration)
- [ ] Component documentation updated with chiropractic-specific examples

---

*This specification follows the Next.js 16 + ShadCN UI template structure and is designed for implementation with modern web technologies including Facebook integration, authentic patient testimonials, and comprehensive chiropractic communication. All components prioritize accessibility, patient trust building, and professional presentation for a chiropractic practice environment.*