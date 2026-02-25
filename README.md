# Purchase Analytics Dashboard

A modern, responsive analytics dashboard built with React, TypeScript, and Tailwind CSS.
Features a "Royal Purple" gradient theme with glassmorphism effects and dark/light mode support.

## 🚀 Key Features

- **Modern UI/UX**: Glassmorphism design with vibrant purple gradients.
- **Dark/Light Mode**: Seamless theme switching with persistent state.
- **Interactive Charts**:
  - Revenue Area Chart with gradient fill (Recharts)
  - Activity Bar Chart (Recharts)
  - Assets Donut Chart (Recharts)
- **Data Tables**: Styled tables with status indicators.
- **Responsive Layout**: Collapsible sidebar (mobile) And fluid grid system.
- **Security Best Practices**:
  - Input validation with Zod schemas
  - Secure routing structure
  - Dependency management with robust lockfiles

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Validation**: Zod + React Hook Form
- **State Management**: Zustand / Context API

## 📦 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🎨 Theme Customization

The theme is controlled via CSS variables in `src/index.css`.
The primary purple palette allows for easy rebranding by adjusting the HSL values in the `:root` scope.

## 🔒 Security Note

This project follows the strict security guidelines provided in `ui-design-guide.md`, including:
- No hardcoded secrets (env vars ready)
- XSS protection via React's default escaping
- Safe dependency choices

---
Created by Antigravity
