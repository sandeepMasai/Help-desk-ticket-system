# Frontend Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The frontend is configured to connect to the backend API at `http://localhost:5000/api` by default.

To change the API URL, create a `.env` file in the `frontend` directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

1. Make sure the backend server is running (see backend README)

2. Start the React development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Features

### User Features
- **Authentication**: Login and Register pages
- **Dashboard**: View all your tickets
- **Create Tickets**: Create new support tickets with title, description, and priority
- **View Ticket Details**: Click on any ticket to see full details and history

### Admin Features
- **Admin Dashboard**: View all tickets from all users
- **Filter Tickets**: Filter by status and priority
- **Manage Tickets**: Update ticket status and priority
- **Add Notes**: Add notes to ticket history
- **Statistics**: View ticket statistics (total, open, in-progress, closed)

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.js
│   │   └── PrivateRoute.js
│   ├── context/           # React Context
│   │   └── AuthContext.js
│   ├── pages/             # Page components
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── AdminDashboard.js
│   │   └── TicketDetail.js
│   ├── services/          # API service layer
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Building for Production

To create a production build:

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure:
1. The backend server is running
2. CORS is enabled in the backend (it should be by default)
3. The API URL in `.env` matches your backend URL

### Authentication Issues
- Make sure you're logged in
- Check that the JWT token is being stored in localStorage
- Verify the backend JWT_SECRET is set

### API Connection Issues
- Verify the backend is running on port 5000
- Check the browser console for API errors
- Ensure the API URL in `.env` is correct

