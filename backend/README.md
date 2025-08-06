# Ampd Energy API

A RESTful API for Ampd Energy device saving data visualization. This API provides endpoints to retrieve carbon and fuel savings data for energy storage systems.

## Features

- RESTful API endpoints for device savings data
- Date range filtering capabilities
- CSV data source integration
- Security middleware (helmet, cors)
- Request logging with Morgan
- Environment-based configuration

## Prerequisites

- Node.js 18.19.0 (specified in .nvmrc)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on port 3000 by default (configurable via PORT environment variable).

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/devices` - List all unique device IDs
- `GET /api/devices/:deviceId/savings` - Get savings data for a specific device with optional date range filtering

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
NODE_ENV=development
```

## Data Source

The API uses CSV files located in the backend directory:
- `device-saving.csv` - Contains device savings data with timestamps
- `devices.csv` - Contains device information

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   └── server.js        # Main server file
├── data/                # CSV data files
├── package.json
└── README.md
``` 