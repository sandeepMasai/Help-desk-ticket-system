# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (or log in if you already have one)
3. Verify your email address

## Step 2: Create a Cluster

1. After logging in, click **"Build a Database"** or **"Create"**
2. Choose the **FREE (M0) tier** (perfect for development)
3. Select a cloud provider and region (choose one closest to you)
4. Give your cluster a name (e.g., "HelpDeskCluster") or use the default
5. Click **"Create Cluster"** (takes 3-5 minutes)

## Step 3: Create Database User

1. While the cluster is creating, you'll see a security setup screen
2. Create a database user:
   - **Username**: `helpdeskuser` (or any username you prefer)
   - **Password**: Click "Autogenerate Secure Password" or create your own
   - **IMPORTANT**: Save this password! You'll need it for the connection string
3. Click **"Create Database User"**

## Step 4: Configure Network Access

1. In the "Network Access" section, click **"Add IP Address"**
2. For development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, you should restrict this to specific IPs
3. Click **"Confirm"**

## Step 5: Get Your Connection String

1. Once your cluster is ready, click **"Connect"** button
2. Choose **"Connect your application"**
3. Select **"Node.js"** as the driver
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` with your database username
6. Replace `<password>` with your database password
7. Add your database name at the end (before the `?`):
   ```
   mongodb+srv://helpdeskuser:yourpassword@cluster0.xxxxx.mongodb.net/helpdesk?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File

1. Open `backend/.env` file
2. Replace `your_mongodb_atlas_connection_string_here` with your connection string from Step 5
3. Replace `your_super_secret_jwt_key_change_this_in_production` with a random secret string (e.g., use a password generator)

Example `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://helpdeskuser:MyPassword123@cluster0.abc123.mongodb.net/helpdesk?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_jwt_key_12345_change_this
NODE_ENV=development
```

## Troubleshooting

### Connection Issues
- Make sure your IP address is whitelisted in Network Access
- Verify your username and password are correct (no special characters need URL encoding)
- Check that your cluster is fully created (not still provisioning)

### Password with Special Characters
If your password has special characters like `@`, `#`, `%`, etc., you need to URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `%` becomes `%25`
- etc.

Or create a new password without special characters.

### Test Connection
After setting up, you can test the connection by running:
```bash
cd backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(err => { console.error('❌ Error:', err.message); process.exit(1); });"
```

