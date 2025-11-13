📌 Help-Desk Ticket System (Basic)

A simple real-world Help-Desk / Support Ticket Management System where users can submit issues, and admins can manage and resolve tickets using a clean dashboard.

This project is designed for entry-level developers to showcase real-world skills such as authentication, CRUD operations, dashboards, and workflow management.

🚀 Features
👤 User Features

Create new support ticket

Select priority (Low / Medium / High)

Track ticket status (Open → In Progress → Closed)

View full ticket history

Secure login & authentication

User dashboard to manage all submitted tickets

🛠️ Admin Features

Admin login access

View all tickets from all users

Search by ticket ID, user email, or title

Filter tickets by status or priority

Update ticket status

Update ticket priority

Add notes to ticket history

Ticket timeline view for full tracking

📚 System Features

Automatic Ticket ID generation

Timestamp logging

Role-based access

Ticket history timeline

Responsive UI

🏗️ Tech Stack
Frontend

React / Next.js

Tailwind CSS / Chakra UI / Material UI (optional)

Axios / Fetch API

Backend

Node.js + Express
OR

Firebase Functions (optional lightweight approach)

Database

MongoDB (MERN version)
OR

Firebase Firestore

Authentication

Firebase Auth
OR

JWT (Node.js backend)

📁 Project Structure (Recommended)
helpdesk-app/
│── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
│
│── README.md

🗂️ Database Schema
Tickets Collection
{
  id: "TCKT-001",
  title: "Cannot login to account",
  description: "When I try to login, it shows an error.",
  priority: "high",
  status: "open",
  userId: "uid123",
  createdAt: "2025-03-12",
  updatedAt: "2025-03-12",
  history: [
    {
      status: "open",
      updatedBy: "uid123",
      timestamp: 16799999999,
      note: "Ticket created"
    }
  ]
}

Users Collection
{
  id: "uid123",
  name: "John Doe",
  email: "john@example.com",
  role: "user"   // or "admin"
}

🔄 Ticket Workflow

The system follows a simple real-world workflow:

Open → In Progress → Closed


Rules:

Only Admin can change status

Closed tickets cannot go back to open

Every change is recorded in ticket history

🔗 API Endpoints (Conceptual)
User Routes
Method	Endpoint	Description
POST	/tickets	Create new ticket
GET	/tickets/user/:id	Get user tickets
GET	/tickets/:ticketId	Get ticket details
Admin Routes
Method	Endpoint	Description
GET	/tickets	Get all tickets
PUT	/tickets/:id/status	Update status
PUT	/tickets/:id/priority	Change priority
POST	/tickets/:id/history	Add history entry
🖼️ Screens Included

Login Page

User Dashboard

Create Ticket Page

Ticket Details Page

Admin Dashboard

Ticket Edit Page (admin)

Ticket History Timeline

🔧 Installation & Setup
1. Clone Repo
git clone https://github.com/your-username/helpdesk-app.git
cd helpdesk-app

2. Install Frontend
cd frontend
npm install
npm start

3. Install Backend
cd backend
npm install
npm run dev

4. Setup Environment Variables

Create .env file for backend:

MONGO_URI=your_mongo_url
JWT_SECRET=your_secret
PORT=5000
