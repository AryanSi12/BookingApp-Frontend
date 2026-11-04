# PRD: Frontend UI/UX Overhaul for the Event & Venue Booking App

> **For Cursor:** This document describes how the frontend should look and behave. The backend is finished. **Do not invent, rename, or remove backend endpoints.** Keep every existing API call (URLs, payloads, auth headers, response handling). Restyle and restructure the React (JSX) + Tailwind frontend around those calls. If a screen here needs data the API doesn't return, degrade gracefully (hide the element, or derive it on the client) and leave a `// TODO(api):` comment. Never add a fake endpoint.

---

## 0. How Cursor should use this PRD
1. Before changing anything, **audit the existing code**: list every API call (search for `fetch(`, `axios`, `api.`, service files), the routes, the auth handling, and the current components. Save the list as `docs/api-inventory.md`.
2. Move all API calls into `src/services/*` (wrap them, don't change them) so UI components never call the network directly.
3. Work through the **phases in §13** in order. After each phase the app must still build and run, and existing flows must still work.
4. Use the design tokens from §4 everywhere. Don't hard-code hex values in components.

---

## 1. Goals & Principles
**Goals**
- A premium, trustworthy product that feels as polished as Linear, Airbnb, or Stripe.
- Quick booking: an end user should be able to go from landing page to confirmed seat in 5 clicks or fewer.
- Organizers can create an event, with images and a venue, in under 3 minutes using a guided wizard.
- Fully responsive, accessible (WCAG 2.1 AA), with dark mode.

**Principles**
1. **Clarity over decoration.** Animation explains state changes and never blocks the user.
2. **Consistency.** Use one design system with tokens only, and one component per pattern.
3. **Feedback everywhere.** Every async action shows a loading, success, or error state.
4. **Content first.** Use large imagery and strong type hierarchy, and leave plenty of whitespace.
5. **Respect motion preferences.** Honor `prefers-reduced-motion`.
6. **Keep the API contract unchanged** (see §0).

---

## 2. Users & Roles
| Role | Primary jobs |
|---|---|
| **End user** | Discover events, filter/search, view details, pick seats, check out, view tickets/QR, manage bookings |
| **Organizer** | Create/edit venues and seat layouts, create/edit/publish events, track sales, view attendees |
| **Guest** | Browse and view events; must sign in to book |

Route guards: use the role from the existing auth response or token. `/organizer/*` requires the organizer role. `/bookings`, `/checkout` require login.

---

## 3. Tech Additions
```bash
npm i framer-motion lucide-react sonner recharts react-hook-form zod @hookform/resolvers \
  clsx tailwind-merge class-variance-authority date-fns qrcode.react canvas-confetti \
  react-dropzone @tanstack/react-query
npm i -D tailwindcss-animate @tailwindcss/forms
npx shadcn@latest init   # style: new-york, base color: slate, CSS variables: yes
npx shadcn@latest add button card input label select dialog sheet dropdown-menu tabs badge \
  avatar skeleton tooltip popover calendar command table separator switch progress \
  form textarea slider toggle-group scroll-area alert-dialog
```
- **Framer Motion**: page transitions and micro-interactions.
- **lucide-react**: the only icon set, at 1.75 stroke width, sized 16/20/24.
- **shadcn/ui (Radix)**: accessible primitives. Copy them into `src/components/ui`.
- **sonner**: toasts. `react-hot-toast` is an acceptable alternative, but use only one.
- **@tanstack/react-query** (optional but recommended): wraps the *existing* service functions for caching and loading states. It does not change the endpoints.
- **Fonts**: *Plus Jakarta Sans* for headings and *Inter* for body text, loaded with `<link rel="preconnect">` and `display=swap`.
- **Images**: Unsplash placeholders, used only when an event has no image:
  `https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=1200&q=80`. Keep a small curated list in `src/lib/placeholders.js` keyed by category (music, tech, sports, theatre, comedy, conference). Always set `alt`, `loading="lazy"`, and an explicit aspect ratio.
- **JSX**: stay on JavaScript. Use the `cn()` helper from `src/lib/utils.js`.

---

## 4. Design System

### 4.1 Palette
The brand feel is "electric evening": deep indigo primary, warm coral accent, slate neutrals.

| Token | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| primary (indigo-violet) | #EEF2FF | #E0E7FF | #C7D2FE | #A5B4FC | #818CF8 | #6366F1 | #4F46E5 | #4338CA | #3730A3 | #312E81 | #1E1B4B |
| accent (coral) | #FFF1EE | #FFE0D9 | #FFC2B3 | #FF9B85 | #FF7A5C | #FF5A36 | #ED3F1A | #C72F10 | #A12813 | #842616 | #470F06 |
| neutral (slate) | #F8FAFC | #F1F5F9 | #E2E8F0 | #CBD5E1 | #94A3B8 | #64748B | #475569 | #334155 | #1E293B | #0F172A | #020617 |

Semantic colors: success `#10B981`, warning `#F59E0B`, danger `#EF4444`, info `#0EA5E9`.

**Seat colors** (meaning is carried by shape or pattern as well as color, see §10):
available `#E2E8F0` with border `#94A3B8` · selected `#4F46E5` · booked `#CBD5E1` with a diagonal stripe · VIP `#F59E0B` outline · accessible `#0EA5E9` outline · held by others `#FBBF24` at 40%.

### 4.2 CSS variables with dark mode (`src/index.css`)
```css
@tailwind base; @tailwind components; @tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;        --foreground: 222 47% 11%;
    --card: 0 0% 100%;              --card-foreground: 222 47% 11%;
    --muted: 210 40% 96%;           --muted-foreground: 215 16% 47%;
    --border: 214 32% 91%;          --input: 214 32% 91%;
    --primary: 243 75% 59%;         --primary-foreground: 0 0% 100%;
    --accent: 11 100% 61%;          --accent-foreground: 0 0% 100%;
    --ring: 243 75% 59%;
    --radius: 0.75rem;
  }
  .dark {
    --background: 229 84% 5%;       --foreground: 210 40% 98%;
    --card: 222 47% 9%;             --card-foreground: 210 40% 98%;
    --muted: 217 33% 17%;           --muted-foreground: 215 20% 65%;
    --border: 217 33% 20%;          --input: 217 33% 20%;
    --primary: 234 89% 74%;         --primary-foreground: 229 84% 5%;
    --accent: 11 100% 67%;          --accent-foreground: 229 84% 5%;
    --ring: 234 89% 74%;
  }
  body { @apply bg-background text-foreground font-sans antialiased; }
  h1,h2,h3,h4 { @apply font-display tracking-tight; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```
Dark mode uses `darkMode: 'class'`. A toggle in the navbar cycles light, dark, and system, and the choice is saved to `localStorage`.

### 4.3 `tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
import animate from 'tailwindcss-animate';
import forms from '@tailwindcss/forms';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', md: '1.5rem', lg: '2rem' }, screens: { '2xl': '1280px' } },
    extend: {
      colors: {
        background: 'hsl(var(--background))', foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        border: 'hsl(var(--border))', input: 'hsl(var(--input))', ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))',
          50:'#EEF2FF',100:'#E0E7FF',200:'#C7D2FE',300:'#A5B4FC',400:'#818CF8',500:'#6366F1',
          600:'#4F46E5',700:'#4338CA',800:'#3730A3',900:'#312E81',950:'#1E1B4B',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))',
          50:'#FFF1EE',100:'#FFE0D9',200:'#FFC2B3',300:'#FF9B85',400:'#FF7A5C',500:'#FF5A36',
          600:'#ED3F1A',700:'#C72F10',800:'#A12813',900:'#842616',950:'#470F06',
        },
        success: '#10B981', warning: '#F59E0B', danger: '#EF4444', info: '#0EA5E9',
        seat: { available:'#E2E8F0', selected:'#4F46E5', booked:'#CBD5E1', vip:'#F59E0B', accessible:'#0EA5E9', held:'#FBBF24' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
      spacing: { 4.5: '1.125rem', 18: '4.5rem', 22: '5.5rem', 30: '7.5rem' }, // 4px base grid
      borderRadius: {
        sm: 'calc(var(--radius) - 6px)', md: 'calc(var(--radius) - 4px)',
        lg: 'var(--radius)', xl: 'calc(var(--radius) + 4px)', '2xl': '1.25rem', '3xl': '1.75rem',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(15 23 42 / 0.05)',
        card: '0 1px 3px rgb(15 23 42 / 0.06), 0 8px 24px -12px rgb(15 23 42 / 0.12)',
        'card-hover': '0 4px 12px rgb(15 23 42 / 0.08), 0 24px 48px -16px rgb(79 70 229 / 0.25)',
        glow: '0 0 0 4px rgb(99 102 241 / 0.25)',
        'glow-accent': '0 10px 40px -10px rgb(255 90 54 / 0.55)',
        inner: 'inset 0 1px 0 0 rgb(255 255 255 / 0.06)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #FF5A36 100%)',
        'hero-mesh': 'radial-gradient(at 20% 20%, rgba(99,102,241,.35) 0, transparent 50%), radial-gradient(at 80% 0%, rgba(255,90,54,.25) 0, transparent 50%), radial-gradient(at 50% 100%, rgba(124,58,237,.25) 0, transparent 50%)',
        'card-overlay': 'linear-gradient(180deg, transparent 40%, rgba(2,6,23,.85) 100%)',
        'stripe-booked': 'repeating-linear-gradient(45deg, #CBD5E1 0 4px, #94A3B8 4px 6px)',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'fade-up': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'fade-up': 'fade-up .4s cubic-bezier(.22,1,.36,1) both',
        float: 'float 6s ease-in-out infinite',
      },
      transitionTimingFunction: { 'out-expo': 'cubic-bezier(.16,1,.3,1)', 'out-quint': 'cubic-bezier(.22,1,.36,1)' },
    },
  },
  plugins: [animate, forms({ strategy: 'class' })],
};
```

### 4.4 Typography usage
| Use | Classes |
|---|---|
| Hero H1 | `font-display text-5xl md:text-6xl lg:text-7xl font-extrabold` |
| Page H1 | `text-3xl md:text-4xl font-bold` |
| Section H2 | `text-2xl md:text-3xl font-bold` |
| Card title | `text-lg font-semibold` |
| Body | `text-base text-foreground/90` |
| Meta/caption | `text-sm text-muted-foreground` |
| Overline | `text-xs font-semibold uppercase tracking-widest text-primary` |
| Prices/stats | `font-display tabular-nums font-bold` |

### 4.5 Spacing & layout
- 4px grid. Section vertical padding is `py-16 md:py-24`. Card padding is `p-4 md:p-6`. Grid gaps are `gap-4 md:gap-6`.
- Max content width is 1280px (`container`). Forms are capped at `max-w-2xl`.

### 4.6 Radius & elevation
Inputs and buttons use `rounded-lg`, cards `rounded-2xl`, modals `rounded-3xl`, and badges and avatars `rounded-full`. Elevation runs `shadow-xs` (inputs), then `shadow-card` (cards), then `shadow-card-hover` (hover), then `shadow-2xl` (modals).

---

## 5. Component Library Spec (`src/components`)
All components accept `className` and merge it with `cn()`. Variants use `cva`.

| Component | Variants / props | Notes |
|---|---|---|
| `Button` | `primary`, `secondary`, `outline`, `ghost`, `destructive`, `gradient`; sizes `sm/md/lg/icon`; `loading`, `leftIcon`, `rightIcon` | Uses `whileTap={{scale:.97}}`. While loading it shows a spinner, sets `aria-busy`, and is disabled. The gradient variant uses `bg-brand-gradient shadow-glow-accent`. |
| `Input`, `Textarea`, `Select` | `error`, `leftIcon` | `h-11`, focus `ring-2 ring-ring`. Error text appears beneath and is linked with `aria-describedby`. |
| `Card` | `interactive` | Interactive cards lift on hover (§9). |
| `Badge` | `default, success, warning, danger, outline, category` | Category colors come from a map. |
| `Avatar` | image or initials fallback | |
| `Navbar` | public and organizer versions | Sticky with `backdrop-blur-lg bg-background/70 border-b`. It shrinks after 24px of scroll. |
| `Footer` | | Four columns on desktop, an accordion on mobile. |
| `EventCard` | `variant="grid" or "list" or "featured"` | See §6.3. |
| `SearchBar` | `size="hero" or "compact"` | Fields for keyword, location, and date. |
| `FilterPanel` | | A sidebar on desktop, a `Sheet` on mobile. |
| `SeatMap`, `Seat`, `SeatLegend` | | See §6.5. |
| `Stepper` | `steps`, `current` | Used in the wizard and checkout. |
| `ImageUploader` | single or multi, `aspect` | Built on react-dropzone. Shows a preview, a progress bar, and a remove button. Uploads through the existing upload call. |
| `StatCard` | `label, value, delta, icon` | The number counts up on mount. |
| `DataTable` | `columns, data, loading` | Sorting, a search box, pagination, a sticky header, and row actions in a dropdown. |
| `EmptyState` | `icon, title, description, action` | |
| `ErrorState` | `onRetry` | |
| `Skeleton` variants | `EventCardSkeleton`, `TableSkeleton`, `DetailSkeleton` | Use a shimmer. |
| `Modal`/`Sheet`/`ConfirmDialog` | | Radix-based, so focus is trapped. |
| `Ticket` | | Perforated-edge ticket with a QR code (§6.7). |
| `PriceTag`, `CountdownTimer`, `ThemeToggle`, `PageTransition`, `ProtectedRoute` | | |

---

## 6. Screen Specs — Public / End User

### 6.1 Landing (`/`)
- **Hero** (`min-h-[88vh]`): a dark background `bg-neutral-950` with a `bg-hero-mesh` overlay and a slow-floating blurred gradient orb. Content order: overline ("Live events, instantly booked"), H1 with a gradient-text keyword (`bg-brand-gradient bg-clip-text text-transparent`), a 1–2 line subtitle, and the hero `SearchBar` in a glass card (`bg-white/10 backdrop-blur-xl border-white/15`). Add trust stats below (e.g. "10k+ seats booked"), using real numbers only if the API provides them; otherwise drop this element. On the right on desktop, show a tilted collage of three event images with a parallax effect on mouse move (±8px).
- **Categories strip**: horizontally scrollable chips, each with a lucide icon (Music, Mic2, Trophy, Theater, Laugh, Presentation). Clicking a chip opens `/events?category=`.
- **Featured events**: a carousel (snap-x) of `EventCard variant="featured"`.
- **Upcoming near you / This week**: a grid of `EventCard`s showing the first 8, plus a "View all" link.
- **How it works**: three steps (Search, Pick seats, Get ticket) with icons, drawn in sequence on scroll.
- **Organizer CTA band**: a gradient band, "Host your event", linking to organizer signup.
- **Footer.**
- Sections reveal with `whileInView` fade-up, `once: true`.

### 6.2 Events listing / Search (`/events`)
- Layout: a compact `SearchBar` at the top. Below it, a 280px left `FilterPanel` and the results on the right.
- Filters (only for fields the API supports; other filters run client-side): category, date range (shadcn Calendar), price range slider, city/venue, availability toggle. Show active filters as removable chips with "Clear all".
- Results header: count, sort dropdown (Date, Price low→high, Popularity), and a grid/list toggle.
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` on full width, or 3 columns with the sidebar.
- Sync filters to the URL query string. Debounce the keyword search by 300ms.
- Pagination: use whatever the API supports. If it has pages, render a "Load more" button or infinite scroll with an IntersectionObserver.

### 6.3 EventCard
- 16:10 image with `rounded-2xl` and `object-cover`. On hover the image zooms to `scale-105` over 500ms.
- Overlay on top of the image: a category badge at top-left, a save/heart icon button at top-right, and a date "calendar block" (month and day) at bottom-left.
- Body: title (2-line clamp), lucide `MapPin` with the venue, `Clock` with the time, and "from ₹X" (`PriceTag`). Show a seats-left indicator when the data allows ("Only 12 left", in warning color when below 10%).
- Sold out: grayscale image, a "Sold out" badge, and the CTA disabled.

### 6.4 Event detail (`/events/:id`)
- **Hero banner**: full-width image at 21:9 on desktop and 4:3 on mobile, with `bg-card-overlay`, and the title and meta set over the image. Back button at top-left.
- **Two columns** on desktop:
  - Left (8/12): tabs or sections for About (rich text), Schedule, Venue (address, map link, venue image), Organizer card, and Policies.
  - Right (4/12): a **sticky booking card** (`top-24`) showing date/time selector (if there are several shows), price tiers, "Select seats" (gradient button), and share/save buttons.
- Mobile: the booking card becomes a **sticky bottom bar** showing the price and a "Select seats" button.
- "You might also like": a row of related events (same category, filtered on the client).

### 6.5 Seat selection (`/events/:id/seats`)
- **Layout**: the stage at the top, drawn as a curved gradient bar labeled "STAGE". The seat grid sits below in an SVG or CSS grid built from the venue layout the API returns (rows, columns, sections, aisles, seat types). Left side: the map. Right side (or a bottom sheet on mobile): the **selection summary**.
- **Seat**: 28px on desktop and 24px on mobile, with `rounded-t-lg rounded-b-sm` so it looks like a chair. Row labels (A, B, C…) on both sides.
- **States** (each also gets a distinct marker so it doesn't rely on color alone):

| State | Style | Interaction |
|---|---|---|
| available | `bg-seat-available border border-neutral-400` | hover: `scale 1.15`, primary border, tooltip "Row C · Seat 7 · ₹499" |
| selected | `bg-seat-selected text-white` + check icon | spring pop; click again to deselect |
| booked | `bg-stripe-booked opacity-60 cursor-not-allowed` | none; `aria-disabled` |
| VIP | amber outline + small crown dot | as available, price tier |
| accessible | sky outline + `Accessibility` icon | as available |
| held (if API exposes) | amber at 40% opacity, pulse | disabled |
| focus | `ring-2 ring-ring ring-offset-2` | keyboard |

- **Legend** (`SeatLegend`): a horizontal row of swatches with labels, always visible above the map.
- **Controls**: zoom in/out/reset (`ZoomIn`, `ZoomOut`, `Maximize`) with CSS transform and pan by drag on desktop; pinch-zoom on mobile. Optionally a minimap for large venues (>300 seats).
- **Rules**: a max-seats-per-booking cap (use the API's value or default to 10, shown with a toast if exceeded). Optionally warn if a single seat is left orphaned.
- **Summary panel**: chips for the selected seats (removable), a price breakdown by tier, the total animating with a count-up, and a "Continue to checkout" button (disabled when nothing is selected). On mobile it's a bottom sheet that expands to show details.
- **Keyboard**: arrow keys move between seats, Enter/Space toggles. The map has `role="grid"` and seats are `role="gridcell"` with `aria-label="Row C seat 7, available, ₹499"` and `aria-pressed`.

### 6.6 Checkout (`/checkout`)
- `Stepper`: Seats → Details → Payment → Done.
- Left: an attendee details form (react-hook-form + zod), prefilled from the profile. Right: an order summary card with the event thumbnail, date, seats, a fee line (only if the API returns fees), and the total.
- If the existing backend uses a hold timer, show a `CountdownTimer` ("Seats held for 09:59"). It turns warning-colored under 2 minutes, and on expiry shows a modal that sends the user back to seats.
- Pay/confirm button: full width, gradient, with a loading state. It calls the **existing booking endpoint unchanged**.
- Error: an inline alert plus a toast. Keep the form values.

### 6.7 Booking confirmation (`/bookings/:id/confirmation`, or the route the app already uses)
- Fire confetti on mount (§9.7). An animated check icon with path draw, then "You're going! 🎉".
- **Ticket component**: a card with a perforated divider (radial-gradient cutouts on the left and right edges). Top half: event image strip, title, date, venue. Bottom half: seats, booking ID (mono font), and a **QR code** (`qrcode.react`, 160px, encoding the booking ID or the ticket token the API returns).
- Actions: "Add to calendar" (generate a client-side `.ics`), "Download ticket" (`window.print()` with a print stylesheet that shows only the ticket), "View my bookings", and "Share".

### 6.8 My bookings (`/bookings`)
- Tabs: Upcoming / Past / Cancelled (filtered on the client if needed).
- List of horizontal ticket-style cards: thumbnail, title, date, seats, status badge, a "View ticket" button that opens a modal with the QR, and a "Cancel" button (only if the API supports it; uses a `ConfirmDialog`).
- Empty state: a ticket illustration/icon, "No bookings yet", and a "Browse events" CTA.

### 6.9 Profile/Settings (if it exists): basic form, theme preference.

---

## 7. Screen Specs — Organizer (`/organizer/*`)
**Shell**: a collapsible left sidebar (264px, or 72px collapsed) with icons: LayoutDashboard, CalendarPlus, CalendarDays, Building2, Users, Settings. A topbar holds breadcrumbs, search, the theme toggle, and the avatar menu. On mobile the sidebar becomes a `Sheet`. The active nav item shows a `layoutId` pill that slides between items.

### 7.1 Dashboard (`/organizer`)
- A greeting ("Good evening, {name}") plus a "Create event" button.
- **4 StatCards**: Total revenue, Tickets sold, Upcoming events, Avg. occupancy %. Each has an icon in a tinted circle and a delta badge if computable. Values count up.
- **Charts (recharts)**, in themed cards:
  - Area chart: bookings/revenue over time with a gradient fill (primary 40% fading to 0%), last 7/30/90 days toggle.
  - Bar chart: tickets sold per event (top 6).
  - Donut: occupancy or category split.
  - Use a custom tooltip styled like a card, with `stroke` colors taken from the tokens. In dark mode, grid lines use `hsl(var(--border))`.
- **Upcoming events** list, and a **Recent bookings** table (5 rows).
- If the backend has no stats endpoint, compute these from the existing events/bookings calls on the client and mark them `// TODO(api)`.

### 7.2 Create / Edit event: wizard (`/organizer/events/new`, `/organizer/events/:id/edit`)
A `Stepper` at the top (clickable for completed steps). Each step validates with zod before moving on. Steps slide horizontally (§9.1). Autosave a draft to `localStorage`.
1. **Basics**: title, category (select with icons), short description, rich description (textarea with a char counter), tags.
2. **Media**: `ImageUploader` for the cover (16:9 crop preview) and a gallery (up to 6, drag to reorder if feasible). Use the existing upload mechanism. If the API takes URLs, keep a URL input fallback.
3. **Venue & schedule**: pick an existing venue (a searchable `Command` combobox showing venue cards) or "Create new venue" (opens §7.3 in a sheet or links to it). Date/time pickers and multiple shows if supported.
4. **Tickets & pricing**: price tiers mapped to seat types or sections from the venue layout, a max-per-order field, and sales start/end dates.
5. **Review & publish**: a live preview, built from the real `EventCard` and a mini detail page, plus a checklist. Buttons: "Save draft" and "Publish". On success, show confetti-lite (small burst) and a toast, then redirect to the events table.
- Footer bar (sticky): Back / Next, plus a "Saving…/Saved" indicator.

### 7.3 Venue creation with seat-layout builder (`/organizer/venues/new`)
- Form: name, address, city, capacity (auto-calculated), images.
- **Layout builder** (canvas area plus a right-hand inspector):
  - Generate a grid from "Rows" and "Seats per row" inputs, plus row-label style (A–Z / 1–n).
  - Tools in a toolbar (ToggleGroup): Select, Paint seat type (Standard / VIP / Accessible), Aisle/remove (Eraser), Section label.
  - Click-drag to multi-select (rubber band), then apply a type, delete, or restore.
  - Add/remove a row or column at any edge. Undo/redo (Ctrl+Z / Ctrl+Shift+Z) uses a history stack.
  - Stage-position selector (top/bottom). Live seat count by type.
  - "Preview as customer" renders the same `SeatMap` used in §6.5.
- Serialize to **exactly the shape the existing venue API expects**. Write an adapter in `src/features/venues/layoutAdapter.js` (layout ↔ API). Don't change the API shape.

### 7.4 Events management (`/organizer/events`)
- `DataTable` columns: thumbnail and title, date, venue, status badge (Draft/Published/Past/Cancelled), a sold/capacity progress bar, revenue, and actions (View, Edit, Duplicate (only if it can reuse create), Delete via `ConfirmDialog`).
- Filters: status tabs, search, and a date filter. On mobile, rows collapse into stacked cards.

### 7.5 Bookings / Attendees (`/organizer/events/:id/attendees` and/or `/organizer/bookings`)
- A header showing the event summary and occupancy ring.
- Table: attendee name/email, seats, booking ID, booked at, status, and check-in (if supported).
- Search, filter by status, and **Export CSV** (generated on the client from the loaded data).
- Optional: a read-only seat map tab that colors booked seats and shows a tooltip with the attendee name.

---

## 8. Auth Pages (`/login`, `/register`, `/forgot-password` if it exists)
- Split layout on desktop. Left: a full-height image (Unsplash concert crowd) with a gradient overlay, the logo, and a rotating testimonial/tagline (fade every 5s). Right: the form card (`max-w-md`).
- Register has a role selector as two big selectable cards: "I want to attend" (Ticket icon) and "I want to host" (Building2 icon). Map the choice to whatever field the existing API uses.
- Inputs have icons (Mail, Lock), a show/hide password toggle, and a password strength meter on register.
- Inline zod validation and API errors shown in an `Alert`. Submit has a loading state. On success, show a toast and redirect by role.
- Mobile: hide the image and show a small gradient header instead.

---

## 9. Animation Spec
**Tokens** (`src/lib/motion.js`):
```js
export const ease = {
  out: [0.22, 1, 0.36, 1],       // default enter
  inOut: [0.65, 0, 0.35, 1],     // page/layout
  expo: [0.16, 1, 0.3, 1],
};
export const duration = { instant: 0.1, fast: 0.15, base: 0.25, slow: 0.4, slower: 0.6 };
export const spring = {
  snappy: { type: 'spring', stiffness: 500, damping: 30 },
  soft: { type: 'spring', stiffness: 260, damping: 24 },
  bouncy: { type: 'spring', stiffness: 600, damping: 15 },
};

// 9.1 Page transitions
export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
  exit:    { opacity: 0, y: -8, transition: { duration: duration.fast, ease: ease.inOut } },
};
// wizard steps (direction = 1 next, -1 back)
export const stepVariants = {
  enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: duration.base, ease: ease.out } },
  exit: (d) => ({ x: d > 0 ? -40 : 40, opacity: 0, transition: { duration: duration.fast } }),
};

// 9.2 Staggered lists
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } },
};

// 9.3 Hover / tap
export const cardHover = {
  rest: { y: 0, boxShadow: 'var(--shadow-card)' },
  hover: { y: -4, transition: spring.soft },
};
export const tap = { scale: 0.97 };

// 9.5 Seat
export const seatVariants = {
  available: { scale: 1 },
  hover: { scale: 1.15, transition: spring.snappy },
  selected: { scale: [1, 1.25, 1], transition: { duration: 0.3, ease: ease.out } },
  rejected: { x: [0, -4, 4, -3, 3, 0], transition: { duration: 0.35 } }, // click booked / over limit
};

// modals & sheets
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: spring.soft },
  exit: { opacity: 0, scale: 0.98, transition: { duration: duration.fast } },
};
```

**Usage**
- **Page transitions**: wrap `<Routes location={location} key={location.pathname}>` in `<AnimatePresence mode="wait">`, and wrap each page in `<motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">`.
- **Staggered cards**: grid `<motion.div variants={staggerContainer} initial="hidden" animate="show">`, children `variants={fadeUp}`. For sections below the fold, use `whileInView="show" viewport={{ once: true, amount: 0.2 }}`. Cap the stagger at the first 12 items.
- **Hover**: cards lift 4px with a soft spring, the shadow moves to `shadow-card-hover`, and the image scales 1.05 over 500ms (CSS). Buttons brighten over 150ms and scale to 0.97 on tap. Icon buttons rotate or nudge their icon (e.g. ArrowRight `x: 3`).
- **9.4 Skeletons**: `relative overflow-hidden bg-muted rounded-lg`, plus an `::after` shimmer (`bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent animate-shimmer -translate-x-full`). Skeletons match the final layout exactly. Show them only after a 150ms delay to avoid flicker.
- **9.5 Seat micro-interactions**: hover uses `seatVariants.hover`; selecting pops the seat and the check icon fades in over 150ms; the summary chip enters with `layout` and a spring; the total uses a count-up (300ms). Clicking a booked seat or going over the limit plays `rejected` and shows a toast.
- **9.6 Numbers**: StatCards count up over 1.2s with `ease.out` using `useMotionValue` + `animate`.
- **9.7 Success confetti**:
```js
import confetti from 'canvas-confetti';
export function celebrate() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#4F46E5', '#818CF8', '#FF5A36', '#F59E0B', '#10B981'];
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors });
  setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors }), 200);
  setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors }), 350);
}
```
- **Check-mark draw**: `motion.path` animating `pathLength` from 0 to 1 over 0.5s with `ease.out`, delayed 0.15s.
- **Reduced motion**: `const reduce = useReducedMotion()`. When it's true, swap the variants to opacity-only and set durations to ≤0.1s. Turn off parallax, float, and confetti.
- **Rules**: never animate layout-thrashing properties (width/height/top). Use transform and opacity only. Nothing over 600ms, except decorative ambient loops.

---

## 10. Empty, Loading & Error States
| Screen | Loading | Empty | Error |
|---|---|---|---|
| Event grid | 8× `EventCardSkeleton` | `SearchX` icon, "No events match your filters", "Clear filters" | `ErrorState` + Retry |
| Event detail | `DetailSkeleton` (banner + 2 col) | 404: "Event not found" + browse CTA | Retry |
| Seat map | Seat-grid shimmer | "Seating not configured" | Retry; if a seat was taken mid-flow: toast "Seat C7 was just booked", remove it from the selection, and refetch |
| Checkout | Button spinner, form disabled | — | Inline alert, values kept |
| My bookings | 3× ticket skeleton | Ticket icon + "Browse events" | Retry |
| Organizer dashboard | StatCard + chart skeletons | "Create your first event" hero card with an illustration | Per-card error with Retry (one failure doesn't break the page) |
| Tables | `TableSkeleton` (5 rows) | Contextual CTA | Retry banner |
- Global: an `ErrorBoundary` with a friendly fallback page, an offline banner (`navigator.onLine`), and a 404 page with illustration plus a home link.
- Toasts (sonner, `position="top-right"` on desktop and `bottom-center` on mobile, `richColors`): success 3s, error 5s with an action where useful.

---

## 11. Responsive & Mobile
Breakpoints (Tailwind defaults): `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`. Design mobile-first.
- **Navbar**: below `md`, a hamburger opens a full-height `Sheet`. Optionally a bottom tab bar for end users (Home, Search, Bookings, Profile).
- **Filters**: below `lg`, a "Filters (n)" button opens a bottom `Sheet` with "Show X results".
- **Event detail**: the booking card turns into a sticky bottom CTA bar (`pb-[env(safe-area-inset-bottom)]`).
- **Seat map**: fits to width initially, with pinch-zoom/pan. The summary becomes a draggable bottom sheet. Tap targets are at least 24px with 4px gaps; at zoom-out, tap targets stay at least 44px with a zoom-to-section behavior.
- **Organizer**: the sidebar becomes a Sheet, tables become cards, charts go full width and stack, and the wizard footer is sticky.
- All tap targets are at least 44×44px. No horizontal page scroll. Test at 360, 390, 768, 1024, and 1440.

---

## 12. Accessibility (WCAG 2.1 AA)
- Text contrast is at least 4.5:1 (large text 3:1). Check primary-on-white and the dark-mode tokens.
- Every interactive element is keyboard reachable with a visible `focus-visible:ring-2 ring-ring ring-offset-2`.
- Add a skip-to-content link, semantic landmarks (`header/nav/main/footer`), and one H1 per page.
- Seat states are never conveyed by color alone: use a pattern (stripes), icons (check, crown, accessibility), and ARIA labels. Announce selection changes through an `aria-live="polite"` region ("Seat C7 selected. 2 seats, total ₹998").
- Forms: labels, `aria-invalid`, and errors linked with `aria-describedby`. Focus moves to the first error on submit.
- Images: meaningful `alt`; decorative ones get `alt=""`. Icon-only buttons get an `aria-label`.
- Radix handles modal focus trapping and Escape. Return focus to the trigger.
- Charts get a text summary or a data table alternative.
- Respect `prefers-reduced-motion` (§9).

---

## 13. Performance
- Lazy-load routes with `React.lazy` + `Suspense` (organizer bundle separate from public). Lazy-load recharts, the seat-builder, and confetti.
- Images: `loading="lazy"`, `decoding="async"`, explicit `width/height` or `aspect-*`, Unsplash `w=` sized per breakpoint with `srcSet`, a blur/solid-color placeholder, and `fetchpriority="high"` on the hero image only.
- Fonts: preconnect, only the weights in use (400/500/600/700/800), `display=swap`.
- Seat map: memoize `Seat` (`React.memo`) and keep selection in a `Set`. For more than 1,000 seats, render with SVG plus a single delegated event handler.
- Debounce search (300ms) and cache API reads (React Query `staleTime: 30s`).
- Targets: Lighthouse Performance ≥90 and Accessibility ≥95 on mobile, LCP <2.5s, CLS <0.1, initial JS <250KB gzipped.

---

## 14. Suggested Folder Structure
```
src/
  main.jsx  App.jsx  index.css
  routes/            # router config, ProtectedRoute, RoleRoute
  layouts/           # PublicLayout, OrganizerLayout, AuthLayout
  services/          # EXISTING API calls moved/wrapped here — unchanged endpoints
    api.js  events.js  venues.js  bookings.js  auth.js  uploads.js
  hooks/             # useEvents, useBooking, useDebounce, useTheme, useCountUp
  lib/               # utils.js (cn), motion.js, placeholders.js, format.js, confetti.js, ics.js
  components/
    ui/              # shadcn primitives
    common/          # Navbar, Footer, EmptyState, ErrorState, Skeletons, PageTransition, ThemeToggle
    events/          # EventCard, SearchBar, FilterPanel, PriceTag
    seats/           # SeatMap, Seat, SeatLegend, SelectionSummary
    booking/         # Ticket, CountdownTimer, OrderSummary
    organizer/       # StatCard, charts/, DataTable, Stepper, ImageUploader
  features/
    venues/          # LayoutBuilder, layoutAdapter.js, builderReducer.js
    events-wizard/   # steps/*, schema.js
  pages/
    public/   Landing, Events, EventDetail, SeatSelection, Checkout, Confirmation, MyBookings, NotFound
    auth/     Login, Register, ForgotPassword
    organizer/ Dashboard, EventsList, EventWizard, VenuesList, VenueBuilder, Attendees
```

---

## 15. Implementation plan

The original sixteen phases are collapsed. Routes, request bodies, and response handling stay as they are in `docs/api-inventory.md`. Screen specs in §6–§12 still apply, adapted to the existing paths (`/get-all-events`, `/event/:eventId`, `/Organizer`, and the rest) rather than the suggested `/events` and `/organizer/*` names.

1. **Audit** — done. `docs/api-inventory.md` and `src/services/*`.
2. **Foundation** — done. Tokens, theme toggle, page transitions, toaster.
3. **Product UI** — one pass covering shared chrome, public booking, auth layouts, and organizer screens:
   - Footer, empty/error states, event cards, `/_styleguide`, 404, and an error boundary.
   - Landing categories (keyword links), how-it-works, and organizer call to action. Listings filter by keyword, location, and sort, synced to the query string. `GET /User/getEventsByQuery` stays unused because its shape is unknown.
   - Event detail, token seat map (legend, zoom, keyboard), checkout stepper around the existing Stripe call, ticket QR / calendar file / print, and upcoming/past bookings.
   - Split auth layouts on the existing login and signup routes.
   - Organizer dashboard aggregated from existing event and seat calls, guided create-event and create-venue steps that still submit the same `FormData`, and attendees from `GET /Organizer/fetchAllBookingsByEventId/:eventId` with CSV of the loaded rows.
   - Loading, empty, and error states on the screens this pass touches, including a real failure state when an event cannot be loaded. Dark surfaces use the semantic tokens. Heavy organizer routes are lazy-loaded. Reduced motion already clamps page animation.

---

## 16. Acceptance Criteria
**Global**
- [ ] No backend endpoint, request payload, or response contract changed. `docs/api-inventory.md` matches the code.
- [ ] No hard-coded hex values in components. Everything uses tokens.
- [ ] Light and dark modes are both complete. The preference persists and respects the system setting.
- [ ] Only lucide icons. Only one toast library.
- [ ] Every route has a page transition. Reduced motion turns off non-essential motion.
- [ ] Every data view has loading (skeleton), empty, and error-with-retry states.
- [ ] No horizontal scroll at 360px. Tap targets are at least 44px.
- [ ] Lighthouse mobile: Performance ≥90, Accessibility ≥95. axe shows 0 critical issues.

**End user**
- [ ] The landing hero, categories, featured, and upcoming sections render with real API data, using Unsplash fallbacks for missing images.
- [ ] Filters and sort update results and the URL. Reloading keeps the filters.
- [ ] Event cards lift on hover, stagger in, and show sold-out and low-stock states.
- [ ] The seat map shows all states plus the legend, supports mouse, touch (pinch-zoom), and keyboard, announces changes, enforces the max seats, and updates the total live.
- [ ] Checkout calls the existing booking endpoint, shows a loading state, and handles errors without losing input.
- [ ] Confirmation shows confetti, the ticket with a scannable QR, Add to calendar, and Print.
- [ ] My bookings shows the upcoming/past tabs and the ticket modal.

**Organizer**
- [ ] The dashboard shows 4 animated stat cards and at least 2 recharts charts that are themed for dark mode.
- [ ] The event wizard validates each step, autosaves a draft, uploads images through the existing mechanism, and previews before publishing.
- [ ] The venue builder generates a grid, paints seat types, removes seats for aisles, supports undo/redo, previews as the customer seat map, and saves in the existing API shape.
- [ ] The events table sorts, searches, filters by status, shows the occupancy bar, and confirms deletes.
- [ ] The attendees view searches, filters, and exports CSV.

**Auth**
- [ ] Split-screen layout, role selection on register, inline validation, and role-based redirect after login.

---

## 17. Out of Scope
- Backend changes, new endpoints, and payment-provider integration beyond what exists.
- Real-time seat locking (unless the backend already supports it; if it does, wire the "held" state).
- Native mobile apps.
