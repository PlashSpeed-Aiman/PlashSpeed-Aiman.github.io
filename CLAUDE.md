# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Aiman Rahim's personal website, currently being migrated from React to Vue 3. It's built with Vue 3, Vite, Vue Router, and Tailwind CSS. The site includes personal blog content, information about "Gerakan Developer Tanahair", and utility tools (QR generator, WhatsApp tool).

## Development Commands

### Running the development server
```bash
npm run dev
```

### Building for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Architecture

### Routing Structure
- Uses Vue Router with hash-based routing (`createWebHashHistory()`)
- Routes are centrally defined in `src/routes.js` using lazy-loaded components
- All route components lazy load via dynamic imports for code splitting

### Application Entry Point
The app initializes in `src/main.js`:
1. Creates Vue app instance
2. Sets up Vue Router with hash history
3. Imports global styles from `src/style.css`
4. Mounts to `#app` div in `index.html`

### Component Architecture
- **App.vue**: Root component that provides the main layout structure with:
  - Fixed header with Navbar (using backdrop-blur)
  - Main content area with `<router-view>` for page components
  - Fixed footer
- **Navbar.vue**: Navigation component with dropdown menus for "Gerakan Developer Tanahair" and "Utilities"
  - Implements custom dropdown logic with click-outside handling
  - Uses responsive design (mobile/desktop layouts)
  - Includes Clock component in header

### Styling
- Tailwind CSS configured to scan all Vue/JS/TS files in `src/**`
- Custom transitions defined in component `<style scoped>` blocks:
  - Slide transition in App.vue
  - Fade transition in Navbar.vue

### Current Migration Status
- Site is actively being converted from React to Vue.js (see disclaimer in App.vue:13)
- HelloWorld.vue component is referenced in App.vue but deleted from git (appears in git status)

## Important Patterns

### Dropdown Implementation
Navbar dropdowns use a combination of:
- `ref` for DOM element references
- Click-outside detection via global document listener in `onMounted`
- Manual state management with reactive `ref` values
- The click-outside logic closes opposite dropdown when one is clicked

### Route Organization
When adding new routes:
1. Create component in `src/components/`
2. Add route entry in `src/routes.js` with lazy import
3. Add navigation link in Navbar.vue dropdown menus as needed
