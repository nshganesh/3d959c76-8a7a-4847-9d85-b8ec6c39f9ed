# Ampd Energy Frontend

A beautiful Vue.js dashboard for visualizing Ampd Energy device savings data with ECharts.js integration.

## Features

- 📊 **Interactive Charts** - Beautiful dual-axis bar charts using ECharts.js
- 📅 **Date Range Filtering** - Filter data by custom date ranges or quick presets
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🎨 **Modern UI** - Clean, professional design with smooth animations
- ⚡ **Real-time Updates** - Live data updates with loading states
- 🔧 **TypeScript** - Full type safety and better development experience

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **ECharts.js** - Powerful charting library
- **Axios** - HTTP client
- **Vite** - Fast build tool and dev server

## Prerequisites

- Node.js 18.19.0
- Backend API running on port 3000

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3002`

## Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable Vue components
│   ├── views/          # Page components
│   ├── stores/         # Pinia state management
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions and API services
│   ├── assets/         # Static assets
│   ├── App.vue         # Root component
│   ├── main.ts         # Application entry point
│   ├── router/         # Vue Router configuration
│   └── style.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

## API Integration

The frontend communicates with the backend API through the `/api` proxy. Make sure the backend is running on port 3000 for the proxy to work correctly.

## Key Components

- **Dashboard** - Main dashboard view with metrics and charts
- **DeviceStore** - Pinia store for managing device data and state
- **API Service** - Axios-based service for API communication
- **ECharts Integration** - Vue-ECharts wrapper for chart components

## Styling

The application uses a custom CSS design system with:
- CSS Custom Properties for theming
- Utility classes for common styles
- Responsive design with mobile-first approach
- Modern color palette with green and blue accents

## Development

- **Type Checking**: `npm run type-check`
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest) 