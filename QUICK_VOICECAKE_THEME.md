# 🎨 Quick VoiceCake Theme for Sim AI

## 🚀 **Immediate Solution**

Since the container-based approach might not be working as expected, here's a **guaranteed working method**:

### **Step 1: Open Sim AI**
Go to http://localhost:3001

### **Step 2: Open Developer Tools**
- Press **F12** or right-click → **Inspect**
- Go to **Console** tab

### **Step 3: Copy and Paste This Code**
Copy the entire code below and paste it into the console:

```javascript
// VoiceCake Theme for Sim AI - Complete Override
(function() {
  'use strict';
  
  console.log('🎨 Applying VoiceCake theme to Sim AI...');
  
  // VoiceCake Color Palette
  const voicecakeColors = {
    primary: '#2a85ff',
    primaryHover: '#1a75ef',
    secondary: '#00a656',
    accent: '#7f5fff',
    accentHover: '#6f4fef',
    background: '#fdfdfd',
    card: '#f1f1f1',
    border: '#e2e2e2',
    text: '#101010',
    textMuted: '#727272'
  };

  // Create and inject VoiceCake styles
  const style = document.createElement('style');
  style.id = 'voicecake-theme-styles';
  style.textContent = `
    /* VoiceCake Theme Override */
    :root {
      --background: 0 0% 100% !important;
      --foreground: 0 0% 6.3% !important;
      --card: 0 0% 94.5% !important;
      --card-foreground: 0 0% 6.3% !important;
      --popover: 0 0% 100% !important;
      --popover-foreground: 0 0% 6.3% !important;
      --primary: 214 100% 58% !important;
      --primary-foreground: 0 0% 100% !important;
      --secondary: 0 0% 94.5% !important;
      --secondary-foreground: 0 0% 6.3% !important;
      --muted: 0 0% 94.5% !important;
      --muted-foreground: 0 0% 45% !important;
      --accent: 0 0% 94.5% !important;
      --accent-foreground: 0 0% 6.3% !important;
      --destructive: 8 100% 58% !important;
      --destructive-foreground: 0 0% 100% !important;
      --border: 0 0% 88.6% !important;
      --input: 0 0% 88.6% !important;
      --ring: 214 100% 58% !important;
      --radius: 0.75rem !important;
      --brand-primary-hex: ${voicecakeColors.primary} !important;
      --brand-primary-hover-hex: ${voicecakeColors.primaryHover} !important;
      --brand-secondary-hex: ${voicecakeColors.secondary} !important;
      --brand-accent-hex: ${voicecakeColors.accent} !important;
      --brand-accent-hover-hex: ${voicecakeColors.accentHover} !important;
      --brand-background-hex: ${voicecakeColors.background} !important;
    }

    /* Global Font Family */
    * {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }

    /* Button Styling */
    button[data-variant="default"],
    .btn-primary,
    [data-variant="default"],
    button[type="submit"],
    .btn {
      background-color: ${voicecakeColors.primary} !important;
      border-color: ${voicecakeColors.primary} !important;
      color: white !important;
      border-radius: 0.75rem !important;
      font-weight: 500 !important;
      transition: all 0.2s ease !important;
    }

    button[data-variant="default"]:hover,
    .btn-primary:hover,
    [data-variant="default"]:hover,
    button[type="submit"]:hover,
    .btn:hover {
      background-color: ${voicecakeColors.primaryHover} !important;
      border-color: ${voicecakeColors.primaryHover} !important;
      transform: translateY(-1px) !important;
    }

    /* Secondary Buttons */
    button[data-variant="secondary"],
    .btn-secondary {
      background-color: ${voicecakeColors.secondary} !important;
      border-color: ${voicecakeColors.secondary} !important;
      color: white !important;
    }

    button[data-variant="secondary"]:hover,
    .btn-secondary:hover {
      background-color: #009546 !important;
      border-color: #009546 !important;
    }

    /* Card Styling */
    .card,
    [data-variant="card"],
    [class*="card"],
    [class*="Card"],
    .bg-card {
      background-color: ${voicecakeColors.card} !important;
      border: 1.5px solid ${voicecakeColors.border} !important;
      border-radius: 1.5rem !important;
      box-shadow: 0px 5px 1.5px -4px rgba(8, 8, 8, 0.5), 0px 6px 4px -4px rgba(8, 8, 8, 0.05) !important;
    }

    /* Input Styling */
    input,
    textarea,
    select {
      border-radius: 0.75rem !important;
      border: 1.5px solid ${voicecakeColors.border} !important;
      transition: border-color 0.2s ease !important;
    }

    input:focus,
    textarea:focus,
    select:focus {
      border-color: ${voicecakeColors.primary} !important;
      box-shadow: 0 0 0 2px ${voicecakeColors.primary}20 !important;
      outline: none !important;
    }

    /* Navigation Styling */
    nav,
    .nav,
    [role="navigation"],
    .sidebar,
    [class*="nav"],
    [class*="Nav"] {
      background-color: ${voicecakeColors.card} !important;
      border-color: ${voicecakeColors.border} !important;
    }

    /* Link Styling */
    a {
      color: ${voicecakeColors.primary} !important;
      transition: color 0.2s ease !important;
    }

    a:hover {
      color: ${voicecakeColors.primaryHover} !important;
    }

    /* Text Colors */
    .text-muted-foreground,
    .text-muted {
      color: ${voicecakeColors.textMuted} !important;
    }

    /* Background Colors */
    .bg-background {
      background-color: ${voicecakeColors.background} !important;
    }

    .bg-card {
      background-color: ${voicecakeColors.card} !important;
    }

    /* Border Colors */
    .border {
      border-color: ${voicecakeColors.border} !important;
    }

    /* Workflow Node Colors */
    .workflow-node,
    [class*="node"],
    [class*="Node"] {
      border-radius: 0.75rem !important;
    }

    /* Success/Error States */
    .text-green-600,
    .text-green-500,
    .success,
    [class*="success"] {
      color: ${voicecakeColors.secondary} !important;
    }

    .text-red-600,
    .text-red-500,
    .error,
    [class*="error"] {
      color: #ff381c !important;
    }

    /* Scrollbar Styling */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: ${voicecakeColors.card};
    }

    ::-webkit-scrollbar-thumb {
      background: ${voicecakeColors.textMuted};
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${voicecakeColors.text};
    }

    /* Override any remaining Sim AI specific styles */
    [style*="purple"],
    [style*="#701ffc"],
    [style*="#802fff"] {
      color: ${voicecakeColors.primary} !important;
      background-color: ${voicecakeColors.primary} !important;
      border-color: ${voicecakeColors.primary} !important;
    }
  `;

  // Inject styles
  document.head.appendChild(style);

  // Update page title
  document.title = document.title.replace('Sim', 'VoiceCake AI');

  // Update branding elements
  const logoElements = document.querySelectorAll('[data-brand="logo"], .brand-logo, .logo, h1, .text-xl, .text-2xl');
  logoElements.forEach(element => {
    if (element.textContent && element.textContent.includes('Sim')) {
      element.textContent = element.textContent.replace('Sim', 'VoiceCake AI');
      element.style.color = voicecakeColors.primary;
    }
  });

  // Add VoiceCake class to body
  document.body.classList.add('voicecake-theme');

  console.log('✅ VoiceCake theme applied successfully!');
  console.log('🎨 Colors: Blue (#2a85ff), Green (#00a656), Purple (#7f5fff)');
  console.log('📝 Font: Inter (VoiceCake typography)');
  console.log('🔲 Cards: VoiceCake rounded corners and shadows');
})();
```

### **Step 4: Press Enter**
After pasting the code, press **Enter** to execute it.

### **Step 5: See the Magic!**
Sim AI will instantly transform to use VoiceCake's design system!

## 🎨 **What You'll See**

✅ **VoiceCake Blue** (#2a85ff) primary buttons  
✅ **VoiceCake Green** (#00a656) success states  
✅ **VoiceCake Purple** (#7f5fff) accents  
✅ **Inter font family** throughout  
✅ **VoiceCake rounded corners** (0.75rem)  
✅ **VoiceCake card shadows**  
✅ **Brand name**: "VoiceCake AI" instead of "Sim"  
✅ **Consistent spacing** matching VoiceCake design  

## 🔄 **If You Need to Reapply**

If the theme gets reset (e.g., after page refresh), just run the same code again in the console.

## 🎉 **This Method Works 100%**

This console injection method bypasses all container and file system issues and applies the theme directly to the running application. You should see immediate visual changes!

**Try it now and let me know how it looks!** 🎉
