# MicroAdventures Color System Documentation

## Overview
This document describes the unified color system for MicroAdventures, implementing a consistent orange/yellow theme across all components.

## Color Palette

### Primary Brand Colors
The color system is built around an orange/yellow gradient that creates a warm, adventurous feeling:

- **Primary Orange**: `#F4A261` (brand-300)
- **Secondary Orange**: `#E76F51` (brand-400)  
- **Dark Orange**: `#D84B40` (brand-500)

### Tailwind Color Classes
The system extends Tailwind CSS with custom color classes:

```javascript
// tailwind.config.js
colors: {
  brand: {
    50: '#FEF7ED',   // Very light orange/yellow
    100: '#FEDFC7',  // Light orange/yellow
    200: '#FDC898',  // Light orange
    300: '#F4A261',  // Primary orange
    400: '#E76F51',  // Secondary orange
    500: '#D84B40',  // Dark orange
    600: '#C23E39',  // Darker orange
    700: '#A32F2A',  // Very dark orange
    800: '#7F2B24',  // Deep orange
    900: '#5C1F1A',  // Darkest orange
  }
}
```

## Centralized Color Utilities

### File: `src/utils/colors.js`
This file provides consistent color classes and utilities:

```javascript
// Primary gradient classes
export const brandGradient = 'bg-gradient-to-r from-brand-300 to-brand-400';
export const brandGradientHover = 'hover:from-brand-400 hover:to-brand-500';

// Button styles
export const primaryButton = `${brandGradient} ${brandGradientHover} text-white transition-all duration-300`;
export const primaryButtonRounded = `${primaryButton} rounded-xl`;

// Error/warning styles (using orange theme)
export const errorText = 'text-error-400';
export const errorBg = 'bg-error-50 border-error-300';

// Common interactions
export const linkHover = 'hover:text-brand-400';
export const focusRing = 'focus:ring-4 focus:ring-brand-300/25';
```

## Usage Examples

### Buttons
```jsx
import { primaryButtonRounded, focusRing } from '../utils/colors';

<button className={`${primaryButtonRounded} ${focusRing} px-6 py-3`}>
  Click Me
</button>
```

### Links and Navigation
```jsx
import { linkHover } from '../utils/colors';

<Link className={`text-gray-900 ${linkHover} transition-colors`}>
  Navigate
</Link>
```

### Error Messages
```jsx
import { errorText, errorBg } from '../utils/colors';

<div className={`${errorBg} p-4 rounded-lg`}>
  <p className={errorText}>Error message here</p>
</div>
```

## Component Implementation

### Updated Components
All major components now use the centralized color system:

1. **Navbar** (`/components/Navbar.jsx`)
   - Profile button uses `brandGradient`
   - Navigation links use `linkHover`
   - Borders use `brand-100`

2. **HomePage** (`/HomePage.jsx`)
   - Main CTA button uses `primaryButtonLarge`
   - Gradient text uses `brandGradientText`
   - Checkmark icons use `brand-400`

3. **AdventureResult** (`/components/AdventureResult.jsx`)
   - Action buttons use `primaryButtonRounded`
   - Background uses `brand-50` to `brand-100`
   - Accent colors use `brand-400`

4. **History** (`/components/History.jsx`)
   - Card accents use `cardAccent`
   - Share buttons use brand colors
   - Error states use orange theme

5. **Plan** (`/components/Plan.jsx`)
   - Form buttons use centralized classes
   - Error messages use orange theme

## Color Semantic Mapping

### Before vs After
- **Error Colors**: Red (`text-red-500`) → Orange (`text-error-400`)
- **Success Colors**: Green (`text-green-500`) → Orange (`text-brand-400`)
- **Warning Colors**: Yellow (`text-yellow-500`) → Orange (`text-warning-400`)
- **Primary Actions**: Various colors → Unified orange gradient

### Key Replacements
- `bg-gradient-to-r from-[#F4A261] to-[#E76F51]` → `brandGradient`
- `hover:from-[#E76F51] hover:to-[#D84B40]` → `brandGradientHover`
- `text-red-500` → `text-error-400`
- `text-green-500` → `text-brand-400`

## Benefits

1. **Single Source of Truth**: All colors defined in one place
2. **Easy Updates**: Change theme by modifying `tailwind.config.js`
3. **Consistency**: All components use the same color system
4. **Maintainability**: Utility classes make updates simple
5. **Accessibility**: Consistent contrast ratios

## Future Updates

To change the color scheme:

1. Update the color values in `tailwind.config.js`
2. Modify utility classes in `src/utils/colors.js` if needed
3. All components automatically use the new colors

## Migration Status

✅ **Complete:**
- Tailwind configuration with unified color palette
- Centralized color utility file
- Navbar component
- HomePage component  
- AdventureResult component
- History component
- Plan component (partial)

🔄 **In Progress:**
- Complete migration of all hardcoded hex colors
- Legacy component updates

## Notes

- All error, warning, and success states now use the orange theme
- The system maintains visual hierarchy through color intensity
- Hover states consistently use darker orange shades
- Focus states use semi-transparent orange rings
- The orange/yellow theme conveys warmth and adventure
