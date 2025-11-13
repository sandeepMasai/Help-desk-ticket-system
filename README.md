# Help Desk Ticket System

A full-stack MERN application for managing help desk tickets with user and admin roles.

## Features

### User Features
- ✅ Create new tickets with title, description, and priority
- ✅ View all personal tickets
- ✅ Filter tickets by status and priority
- ✅ View detailed ticket information
- ✅ Track ticket status changes through history timeline

### Admin Features
- ✅ View all tickets from all users
- ✅ Filter tickets by status, priority
- ✅ Search tickets by Ticket ID, Title, or User Email
- ✅ Update ticket status (Open → In Progress → Closed)
- ✅ Update ticket priority
- ✅ Add notes to ticket history
- ✅ View complete ticket history timeline

### System Features
- ✅ JWT-based authentication
- ✅ Role-based access control (User/Admin)
- ✅ MongoDB database for data persistence
- ✅ Auto-generated ticket IDs (TCKT-001, TCKT-002, etc.)
- ✅ Timestamps for all ticket actions
- ✅ Complete ticket history tracking

## Technology Stack

- **Frontend**: React 18, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Project Structure

```
Help-desk-ticket-system/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Ticket.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tickets.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Navbar.js
│   │   │   ├── user/
│   │   │   │   ├── UserDashboard.js
│   │   │   │   ├── CreateTicket.js
│   │   │   │   └── TicketDetails.js
│   │   │   └── admin/
│   │   │       ├── AdminLogin.js
│   │   │       ├── AdminDashboard.js
│   │   │       └── AdminTicketEdit.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Creating Admin Account

To create an admin account, you can either:

1. **Using the registration endpoint directly:**
   - Register a user through the frontend
   - Then manually update the user's role in MongoDB to "admin"

2. **Using MongoDB directly:**
   - Connect to your MongoDB database
   - Insert a user document with `role: "admin"`

3. **Using a script (recommended):**
   Create a file `backend/scripts/createAdmin.js`:
```javascript
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin created:', admin.email);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
```

Run it with: `node backend/scripts/createAdmin.js`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### User Tickets
- `POST /api/tickets` - Create new ticket (requires auth)
- `GET /api/tickets/user/:id` - Get user's tickets (requires auth)
- `GET /api/tickets/:id` - Get ticket details (requires auth)

### Admin
- `GET /api/admin/tickets` - Get all tickets (requires admin)
- `GET /api/admin/tickets/:id` - Get ticket details (requires admin)
- `PUT /api/admin/tickets/:id/status` - Update ticket status (requires admin)
- `PUT /api/admin/tickets/:id/priority` - Update ticket priority (requires admin)
- `POST /api/admin/tickets/:id/history` - Add note to ticket (requires admin)

## Ticket Status Workflow

Tickets follow this workflow:
- **Open** → **In Progress** → **Closed**

Rules:
- Users can only view their tickets
- Only admins can update ticket status
- Closed tickets cannot be reopened to "Open" status

## Ticket ID Format

Tickets are automatically assigned IDs in the format:
- TCKT-001
- TCKT-002
- TCKT-003
- etc.

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: 'user', 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

### Ticket Model
```javascript
{
  ticketId: String (unique),
  title: String,
  description: String,
  priority: String (enum: 'low', 'medium', 'high'),
  status: String (enum: 'open', 'in-progress', 'closed'),
  userId: ObjectId (ref: User),
  history: [{
    status: String,
    priority: String,
    updatedBy: ObjectId (ref: User),
    timestamp: Date,
    note: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

1. **As a User:**
   - Register/Login at `/login`
   - Create tickets from the dashboard
   - View and track your tickets
   - See ticket history and status updates

2. **As an Admin:**
   - Login at `/admin/login`
   - View all tickets in the dashboard
   - Filter and search tickets
   - Update ticket status and priority
   - Add notes to tickets
   - View complete ticket history

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- Protected API routes
- Input validation

## Future Enhancements

- Email notifications
- File attachments
- Ticket comments/threads
- Dashboard analytics
- Export tickets to CSV/PDF
- Real-time updates with WebSockets

## License

ISC

## Support

For issues or questions, please create a ticket in the system! 😊
