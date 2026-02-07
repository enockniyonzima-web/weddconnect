# ClientPageHeroSection Usage Guide

## 🎨 Component Overview

The `ClientPageHeroSection` is a modern, iconic, and responsive hero section component designed for client management pages. It automatically adapts its styling based on the page context.

---

## ✨ Features

### 🎯 Smart Theme Detection
The component automatically detects the page type from the title and applies appropriate colors:

| Page Type | Icon | Color Theme | Gradient |
|-----------|------|-------------|----------|
| **Active Subscriptions** | Users icon | Green | Emerald gradient |
| **Expired Subscriptions** | Calendar icon | Red | Rose gradient |
| **Pending Subscriptions** | TrendingUp icon | Amber/Orange | Orange gradient |
| **No Subscriptions** | UserX icon | Gray | Slate gradient |
| **Default (Others)** | Users icon | Blue | Indigo gradient |

### 📱 Responsive Design
- **Mobile**: Stacked vertical layout
- **Tablet**: Optimized two-column layout
- **Desktop**: Full horizontal layout with stats and actions

### 🎨 Brand Colors
- Uses white backgrounds with colored accent gradients
- Black/Gray text hierarchy
- Contextual color coding for different states

---

## 📝 Component Props

```typescript
interface ClientPageHeroSectionProps {
  title: string;              // Page title (required)
  description?: string;        // Optional description text
  actionBtn?: ReactNode;       // Optional action button
  stats?: {                    // Optional stats card
    total: number;            // Number to display
    label: string;            // Label for the stat
  }
}
```

---

## 🚀 Usage Examples

### Example 1: Active Subscriptions Page
```tsx
import { ClientPageHeroSection } from "./sections";
import { Plus } from "lucide-react";

export default async function ActiveClientsPage() {
  const clients = await fetchActiveClients();
  
  return (
    <div className="w-full p-6 space-y-6">
      <ClientPageHeroSection
        title="Active Subscriptions"
        description="Clients with active and valid subscription plans"
        stats={{
          total: clients.length,
          label: "Active Clients"
        }}
        actionBtn={
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            Add Client
          </button>
        }
      />
      
      {/* Your client list component */}
      <ClientsContainer clients={clients} />
    </div>
  );
}
```

**Result**: Green theme with Users icon, showing active client count

---

### Example 2: Expired Subscriptions Page
```tsx
import { ClientPageHeroSection } from "./sections";
import { RefreshCw } from "lucide-react";

export default async function ExpiredClientsPage() {
  const expiredClients = await fetchExpiredClients();
  
  return (
    <div className="w-full p-6 space-y-6">
      <ClientPageHeroSection
        title="Expired Subscriptions"
        description="Clients whose subscription plans have expired and need renewal"
        stats={{
          total: expiredClients.length,
          label: "Expired"
        }}
        actionBtn={
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
            <RefreshCw className="w-4 h-4" />
            Send Reminders
          </button>
        }
      />
      
      <ClientsContainer clients={expiredClients} />
    </div>
  );
}
```

**Result**: Red theme with Calendar icon, showing expired count

---

### Example 3: Pending Subscriptions Page
```tsx
import { ClientPageHeroSection } from "./sections";
import { CheckCircle } from "lucide-react";

export default async function PendingClientsPage() {
  const pendingClients = await fetchPendingClients();
  
  return (
    <div className="w-full p-6 space-y-6">
      <ClientPageHeroSection
        title="Pending Subscriptions"
        description="Clients with pending payment verification for their subscriptions"
        stats={{
          total: pendingClients.length,
          label: "Pending Approval"
        }}
        actionBtn={
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium">
            <CheckCircle className="w-4 h-4" />
            Review All
          </button>
        }
      />
      
      <ClientsContainer clients={pendingClients} />
    </div>
  );
}
```

**Result**: Amber/Orange theme with TrendingUp icon, showing pending count

---

### Example 4: No Subscriptions Page
```tsx
import { ClientPageHeroSection } from "./sections";
import { Mail } from "lucide-react";

export default async function NoSubscriptionClientsPage() {
  const clients = await fetchClientsWithoutSubscription();
  
  return (
    <div className="w-full p-6 space-y-6">
      <ClientPageHeroSection
        title="No Subscriptions"
        description="Clients who haven't chosen or subscribed to any plan yet"
        stats={{
          total: clients.length,
          label: "Without Plans"
        }}
        actionBtn={
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
            <Mail className="w-4 h-4" />
            Send Offers
          </button>
        }
      />
      
      <ClientsContainer clients={clients} />
    </div>
  );
}
```

**Result**: Gray theme with UserX icon, showing unsubscribed count

---

### Example 5: Simple Title Only
```tsx
<ClientPageHeroSection
  title="Manage Subscriptions"
  description="View and manage all subscription plans available to clients"
/>
```

**Result**: Blue default theme with Users icon, no stats or action button

---

### Example 6: With Stats, No Action Button
```tsx
<ClientPageHeroSection
  title="Active Subscriptions"
  description="Currently active subscription plans"
  stats={{
    total: 127,
    label: "Active Users"
  }}
/>
```

---

### Example 7: With Action Button, No Stats
```tsx
<ClientPageHeroSection
  title="Client Management"
  description="Manage all platform clients and their subscriptions"
  actionBtn={
    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
      Export Report
    </button>
  }
/>
```

---

## 🎨 Visual Elements

### Icon Section
- Colored background (matches theme)
- Large icon (8x8)
- Rounded square with shadow
- Flex-shrink-0 for consistency

### Title & Description
- Title: 2xl-3xl, bold, gray-900
- Description: sm-base, gray-600, leading-relaxed
- Responsive sizing
- Flexible width with min-w-0

### Stats Card (Optional)
- White background with border
- Large number with gradient text
- Small label below
- Min-width: 140px
- Shadow and rounded corners

### Action Button (Optional)
- Custom button component passed as prop
- Flexible positioning
- Recommended: Use Lucide icons with text

---

## 🎯 Color Schemes

### Active (Green)
```
Background: from-green-50 to-emerald-50
Border: border-green-200
Icon BG: bg-green-100
Icon Color: text-green-600
Gradient: from-green-500 to-green-600
```

### Expired (Red)
```
Background: from-red-50 to-rose-50
Border: border-red-200
Icon BG: bg-red-100
Icon Color: text-red-600
Gradient: from-red-500 to-red-600
```

### Pending (Amber/Orange)
```
Background: from-amber-50 to-orange-50
Border: border-amber-200
Icon BG: bg-amber-100
Icon Color: text-amber-600
Gradient: from-amber-500 to-orange-600
```

### No Subscription (Gray)
```
Background: from-gray-50 to-slate-50
Border: border-gray-200
Icon BG: bg-gray-100
Icon Color: text-gray-600
Gradient: from-gray-500 to-gray-600
```

### Default (Blue)
```
Background: from-blue-50 to-indigo-50
Border: border-blue-200
Icon BG: bg-blue-100
Icon Color: text-blue-600
Gradient: from-blue-500 to-blue-600
```

---

## 📱 Responsive Breakpoints

```css
Mobile (< 768px):
- Stacked vertical layout
- Full width stats card
- Padding: p-6

Tablet (768px+):
- Horizontal layout begins
- Stats and button in row
- Padding: p-6-8

Desktop (1024px+):
- Full horizontal layout
- Optimized spacing
- Padding: p-8
```

---

## ♿ Accessibility

- Semantic HTML structure
- Proper heading hierarchy (h1)
- Color contrast ratios meet WCAG AA
- Touch-friendly tap targets
- Keyboard navigable (if action button provided)

---

## 🛠️ Customization Tips

### Custom Action Buttons
```tsx
// Primary Action
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Action
</button>

// Secondary Action
<button className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
  Action
</button>

// Danger Action
<button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
  Delete
</button>
```

### Multiple Actions
```tsx
actionBtn={
  <div className="flex gap-2">
    <button className="...">Export</button>
    <button className="...">Import</button>
  </div>
}
```

---

## 📚 Import Statement

```tsx
import { ClientPageHeroSection } from "@/app/dashboard/admin/clients/sections";
```

---

## ✅ Best Practices

1. **Always provide a title** - Required for theme detection
2. **Use clear descriptions** - Helps users understand the page context
3. **Match button colors to theme** - Use contextual colors
4. **Keep stats concise** - Short labels work best
5. **Use Lucide icons** - Maintains consistency with the design system
6. **Test responsive behavior** - Check on mobile, tablet, desktop

---

## 🎉 Summary

The `ClientPageHeroSection` provides:
- ✅ Automatic theme detection based on page type
- ✅ Responsive layout for all devices
- ✅ Optional stats display
- ✅ Flexible action button support
- ✅ Brand-aligned color schemes
- ✅ Modern, iconic design
- ✅ Easy to use and customize
