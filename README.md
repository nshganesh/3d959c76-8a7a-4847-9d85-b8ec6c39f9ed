# Ampd Energy - Device Savings Dashboard

A complete full-stack application for visualizing Ampd Energy device savings data, featuring a Node.js Express API backend and a beautiful Vue.js frontend with ECharts.js integration.

## 🎯 Project Overview

This application helps Ampd Energy customers visualize their carbon and diesel savings from energy storage systems. The dashboard provides interactive charts, date range filtering, and real-time data visualization.

## 🏗️ Architecture

```
Coding Challenge_Ampd/
├── backend/          # Node.js Express API
├── frontend/         # Vue.js Dashboard
├── data/            # CSV data files
└── assets/          # Mockup images
```

## ✨ Features

### Backend API
- **RESTful API** with Express.js
- **CSV Data Processing** with 175,210+ records
- **Date Range Filtering** with validation
- **Pagination Support** for large datasets
- **Input Validation** and error handling
- **Security Middleware** (helmet, CORS)
- **Request Logging** with Morgan

### Frontend Dashboard
- **Interactive Charts** using ECharts.js
- **Real-time Data Updates** with loading states
- **Date Range Selection** with quick presets
- **Responsive Design** for all devices
- **TypeScript** for type safety
- **Modern UI** with smooth animations
- **State Management** with Pinia

## 🚀 Quick Start

### Prerequisites
- Node.js 18.19.0 (specified in .nvmrc files)
- npm or yarn

### 1. Clone and Setup
```bash
git clone <repository-url>
cd Coding Challenge_Ampd
```

### 2. Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend will be available at `http://localhost:3000`

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:3002`

## 📊 API Endpoints

### Devices
- `GET /api/devices` - Get all unique device IDs
- `GET /api/devices/:deviceId/savings` - Get device savings with optional date filtering
- `GET /api/devices/:deviceId/summary` - Get device summary statistics

### Query Parameters
- `startDate` - ISO string for start date
- `endDate` - ISO string for end date
- `limit` - Number of records (max 1000)
- `offset` - Number of records to skip

### Example Usage
```bash
# Get all devices
curl http://localhost:3000/api/devices

# Get device savings for last 30 days
curl "http://localhost:3000/api/devices/1/savings?startDate=2024-01-01T00:00:00.000Z&endDate=2024-01-31T23:59:59.999Z"

# Get device summary
curl http://localhost:3000/api/devices/1/summary
```

## 🎨 Frontend Features

### Dashboard Components
1. **Header** - Title and download link
2. **Key Metrics** - Total and monthly carbon/diesel savings
3. **Date Range Selector** - Custom dates and quick presets
4. **Summary Section** - Selected date range totals
5. **Interactive Chart** - Monthly trends with dual-axis

### Chart Features
- **Dual-axis Bar Chart** - Carbon (left) and Diesel (right)
- **Interactive Tooltips** - Detailed information on hover
- **Responsive Design** - Adapts to screen size
- **Color-coded** - Green for carbon, blue for diesel

## 🛠️ Technology Stack

### Backend
- **Node.js 18.19.0** - Runtime environment
- **Express.js** - Web framework
- **csv-parser** - CSV data processing
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logging

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **ECharts.js** - Charting library
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

## 📁 Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Validation and error handling
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic (CSV loader)
│   └── server.js       # Main application file
├── data/              # CSV data files
├── package.json       # Dependencies and scripts
└── README.md          # Backend documentation
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/     # Reusable Vue components
│   ├── views/          # Page components
│   ├── stores/         # Pinia state management
│   ├── types/          # TypeScript definitions
│   ├── utils/          # API services and utilities
│   ├── App.vue         # Root component
│   ├── main.ts         # Application entry point
│   └── style.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
└── README.md           # Frontend documentation
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon
npm start           # Start production server
```

### Frontend Development
```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run type-check  # TypeScript type checking
```

## 📈 Data Processing

The application processes CSV data with the following structure:
- **device-saving.csv** - 175,210+ records with device savings data
- **devices.csv** - 10 device records

### Data Fields
- `device_id` - Unique device identifier
- `timestamp` - Record timestamp
- `device_timestamp` - Device-specific timestamp
- `carbon_saved` - Carbon savings in kg
- `fuel_saved` - Fuel savings in liters

## 🎯 UI/UX Design

The frontend closely matches the provided mockup with:
- **Clean, modern design** with green and blue color scheme
- **Responsive layout** that works on all devices
- **Interactive elements** with hover states and animations
- **Professional typography** using Inter font
- **Accessible design** with proper contrast and focus states

## 🔒 Security Features

- **Input validation** on all API endpoints
- **CORS configuration** for cross-origin requests
- **Security headers** with helmet middleware
- **Error handling** with proper HTTP status codes
- **Request logging** for monitoring and debugging

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm install --production
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Serve dist/ folder with your web server
```

## 📝 API Documentation

### Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the Ampd Energy coding challenge.

## 🎉 Success!

The application successfully demonstrates:
- ✅ Complete full-stack implementation
- ✅ Beautiful, responsive UI matching the mockup
- ✅ Interactive charts with ECharts.js
- ✅ Real-time data filtering and visualization
- ✅ Professional code structure and best practices
- ✅ TypeScript for type safety
- ✅ Comprehensive error handling
- ✅ Modern development workflow

Both the backend API and frontend dashboard are now running and ready for use! 