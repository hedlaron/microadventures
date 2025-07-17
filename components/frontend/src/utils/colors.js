/**
 * Centralized color system for MicroAdventures
 * This file provides consistent color classes and utilities for the orange/yellow theme
 */

// Primary gradient classes - the main brand colors
export const brandGradient = "bg-gradient-to-r from-brand-300 to-brand-400";
export const brandGradientHover = "hover:from-brand-400 hover:to-brand-500";
export const brandGradientText =
  "text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-400";

// Common button styles
export const primaryButton = `${brandGradient} ${brandGradientHover} text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-0`;
export const primaryButtonRounded = `${primaryButton} rounded-xl`;
export const primaryButtonLarge = `${primaryButton} rounded-2xl text-white`;

// Error/warning styles using orange theme
export const errorText = "text-error-400";
export const errorBg = "bg-error-50 border-error-300";
export const errorBorder = "border-error-300";

// Focus styles
export const focusRing = "focus:ring-4 focus:ring-brand-300/25";

// Hover colors for links and interactive elements
export const linkHover = "hover:text-brand-400";
export const iconHover = "hover:text-brand-400";

// Profile/avatar colors
export const profileBg = brandGradient;

// Common color combinations
export const cardAccent = "text-brand-400";
export const cardAccentSecondary = "text-brand-300";

/**
 * Legacy color mappings for gradual migration
 * These maintain the exact hex values while transitioning to the new system
 */
export const legacyColors = {
  // Original gradient colors
  primaryOrange: "#F4A261", // brand-300
  secondaryOrange: "#E76F51", // brand-400
  darkOrange: "#D84B40", // brand-500
  lightYellow: "#FFD166", // For special cases like the form background
};

/**
 * Utility function to get consistent gradient classes
 */
export const getGradientClasses = (variant = "primary") => {
  switch (variant) {
    case "primary":
      return `${brandGradient} ${brandGradientHover}`;
    case "text":
      return brandGradientText;
    case "button":
      return primaryButton;
    default:
      return brandGradient;
  }
};

/**
 * Utility function to get error/warning classes
 */
export const getStatusClasses = (type = "error") => {
  return {
    text: `text-${type}-400`,
    bg: `bg-${type}-50 border-${type}-300`,
    border: `border-${type}-300`,
  };
};
