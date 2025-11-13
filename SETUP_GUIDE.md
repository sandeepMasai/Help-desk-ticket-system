# Quick Setup Guide

## ✅ Step 1: Configure MongoDB Atlas

1. Follow the instructions in `MONGODB_SETUP.md` to:
   - Create a MongoDB Atlas account
   - Create a cluster
   - Get your connection string

2. Update `backend/.env` with your MongoDB connection string:
   ```env
   MONGODB_URI=your_connection_string_here
   JWT_SECRET=31fde1265bf9eab754ba5a5b9a3ed94872eedb12f5000ffd5b820482eb07e339
   ```

## ✅ Step 2: Install Backend Dependencies

Run this command:
```bash
cd backend && npm install
```

## ✅ Step 3: Install Frontend Dependencies

Run this command:
```bash
cd frontend && npm install
```

## ✅ Step 4: Start the Backend Server

In one terminal:
```bash
cd backend
npm run dev
```

You should see:
- ✅ MongoDB Connected
- ✅ Server running on port 5000

## ✅ Step 5: Create Admin Account

In a new terminal (while backend is running):
```bash
cd backend
node scripts/createAdmin.js
```

This creates:
- **Email**: admin@example.com
- **Password**: admin123

## ✅ Step 6: Start the Frontend

In another terminal:
```bash
cd frontend
npm start
```

The app will open at `http://localhost:3000`

## 🎉 You're Ready!

- **User Login**: http://localhost:3000/login
- **Admin Login**: http://localhost:3000/admin/login

---

## Troubleshooting

### Backend won't start
- Check that MongoDB connection string is correct in `.env`
- Make sure MongoDB Atlas cluster is running
- Verify your IP is whitelisted in MongoDB Atlas Network Access

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check browser console for CORS errors
- Verify `REACT_APP_API_URL` in frontend/.env (optional, defaults to localhost:5000)

### Admin script fails
- Make sure backend server is running first
- Check MongoDB connection string
- Verify .env file exists and has correct values

