# Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure MongoDB
1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Create a `.env` file in the root directory:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vms?retryWrites=true&w=majority
   ```
   Replace `username`, `password`, and `cluster` with your actual MongoDB Atlas credentials.

### 3. Start the Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### 4. Access the Application
Open your browser and go to: `http://localhost:3000`

## First Use

1. **Register a Visitor**:
   - Click "Register Visitor"
   - Fill in all required fields
   - Note the QR code and last 4 digits of Aadhar (access code)

2. **Check-In**:
   - Go to "Check-In/Out"
   - Use QR code or last 4 Aadhar digits
   - Click "Check-In"

3. **Check-Out**:
   - Go to "Check-In/Out" → "Check-Out" tab
   - Enter verification code
   - Optionally set expected return time
   - Click "Check-Out"

4. **View Statistics**:
   - Dashboard shows real-time statistics
   - "Visitors Inside" shows all current visitors

## Troubleshooting

### MongoDB Connection Error
- Verify your connection string in `.env`
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure your MongoDB cluster is running

### Port Already in Use
- Change the PORT in `.env` file
- Or stop the process using port 3000

### Module Not Found
- Run `npm install` again
- Check if `node_modules` folder exists

