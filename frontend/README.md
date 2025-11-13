# Help Desk Ticket System - Frontend

React frontend for the Help Desk Ticket System.

## Features

- User authentication (Login/Register)
- User dashboard to create and view tickets
- Admin dashboard to manage all tickets
- Ticket detail view with history
- Modern, responsive UI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, defaults to `http://localhost:5000/api`):
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── context/        # React context providers
  ├── pages/          # Page components
  ├── services/       # API service layer
  └── App.js          # Main app component
```

