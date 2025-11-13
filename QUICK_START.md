# 🚀 Quick Start - Help Desk Ticket System

## ✅ What's Done
- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed
- ✅ `.env` file created in `backend/` directory
- ✅ JWT secret generated

## 📋 Next Steps

### 1. Set Up MongoDB Atlas (5-10 minutes)

**Follow these steps:**

1. **Sign up/Login**: Go to https://www.mongodb.com/cloud/atlas/register
2. **Create Free Cluster**: 
   - Click "Build a Database"
   - Choose FREE (M0) tier
   - Select region closest to you
   - Click "Create Cluster"
3. **Create Database User**:
   - Username: `helpdeskuser` (or your choice)
   - Password: Save it securely!
   - Click "Create Database User"
4. **Network Access**:
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials
   - Add database name: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/helpdesk?retryWrites=true&w=majority`

### 2. Update .env File

Open `backend/.env` and replace the MongoDB URI:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/helpdesk?retryWrites=true&w=majority
JWT_SECRET=31fde1265bf9eab754ba5a5b9a3ed94872eedb12f5000ffd5b820482eb07e339
NODE_ENV=development
```

### 3. Start Backend Server

Open a terminal and run:
```bash
cd backend
npm run dev
```

You should see:
```
MongoDB Connected
Server running on port 5000
```

### 4. Create Admin Account

Open a **new terminal** (keep backend running) and run:
```bash
cd backend
node scripts/createAdmin.js
```

This creates:
- **Email**: admin@example.com
- **Password**: admin123

### 5. Start Frontend

Open **another terminal** and run:
```bash
cd frontend
npm start
```

The browser will open automatically at `http://localhost:3000`

## 🎉 You're Ready!

### Test the Application:

1. **As a User**:
   - Go to http://localhost:3000/login
   - Click "Register" to create an account
   - Create a ticket
   - View your tickets

2. **As an Admin**:
   - Go to http://localhost:3000/admin/login
   - Login with: admin@example.com / admin123
   - View all tickets
   - Update ticket status and priority

## 🔧 Troubleshooting

### "MongoDB connection error"
- ✅ Check your connection string in `.env`
- ✅ Verify username/password are correct
- ✅ Make sure your IP is whitelisted in MongoDB Atlas
- ✅ Ensure cluster is fully created (not still provisioning)

### "Cannot find module" errors
- ✅ Make sure you ran `npm install` in both backend and frontend
- ✅ Check you're in the correct directory

### Frontend can't connect to backend
- ✅ Make sure backend is running on port 5000
- ✅ Check browser console for errors
- ✅ Verify CORS is enabled (it is by default)

### Admin script fails
- ✅ Make sure backend server is running first
- ✅ Check MongoDB connection is working
- ✅ Verify `.env` file has correct MONGODB_URI

## 📚 Need More Help?

- See `MONGODB_SETUP.md` for detailed MongoDB Atlas instructions
- See `SETUP_GUIDE.md` for step-by-step setup
- Check `README.md` for full documentation

