# Visitor Management System (VMS) for Hotels

A secure and efficient digital Visitor Management System designed for hotels and offices. This system provides a verifiable digital trail through QR code scanning or 4-digit Aadhar-based access codes.

## Features

- **Visitor Registration**: Register visitors with Aadhar number verification
- **QR Code Generation**: Automatic QR code generation for each visitor
- **Check-In/Check-Out**: Track visitor entry and exit
- **Return Consent**: When a visitor checks out, ask for expected return time
- **Real-time Statistics**: 
  - How many visitors are currently inside
  - How many visitors have left
  - Today's check-ins and check-outs
  - Total registered visitors
  - Visitors with return consent
- **Digital Trail**: Complete tracking of all visitor movements

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas

## Installation

1. **Clone or download the project**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the root directory
   - Add your MongoDB Atlas connection string:
     ```
     PORT=3000
     MONGODB_URI=your_mongodb_atlas_connection_string_here
     ```

4. **Start the server**:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

## Usage

### Register a Visitor
1. Navigate to "Register Visitor" section
2. Fill in all required fields (marked with *)
3. The system will generate a QR code and display the last 4 digits of Aadhar as access code

### Check-In
1. Go to "Check-In/Out" section
2. Select verification method (QR Code or Aadhar Last 4 Digits)
3. Enter the verification code
4. Click "Check-In"

### Check-Out
1. Go to "Check-In/Out" section
2. Switch to "Check-Out" tab
3. Enter verification code (QR or Aadhar last 4 digits)
4. Optionally specify expected return time
5. Click "Check-Out"

### View Statistics
- The Dashboard shows real-time statistics
- "Visitors Inside" section shows all currently inside visitors

## API Endpoints

### Visitor Routes
- `POST /api/visitors/register` - Register a new visitor
- `POST /api/visitors/verify` - Verify visitor by QR code or Aadhar
- `GET /api/visitors` - Get all visitors
- `GET /api/visitors/:id` - Get visitor by ID

### Check-In Routes
- `POST /api/checkin` - Check-in a visitor

### Check-Out Routes
- `POST /api/checkout` - Check-out a visitor

### Statistics Routes
- `GET /api/stats` - Get all statistics
- `GET /api/stats/inside` - Get visitors currently inside

## Project Structure

```
VisitorManagementSystem/
├── backend/
│   ├── models/
│   │   └── Visitor.js
│   └── routes/
│       ├── visitorRoutes.js
│       ├── checkinRoutes.js
│       ├── checkoutRoutes.js
│       └── statsRoutes.js
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── server.js
├── package.json
└── README.md
```

## Security Features

- Unique QR code generation for each visitor
- Aadhar-based verification (last 4 digits)
- Complete audit trail of all check-ins and check-outs
- Visitor status tracking (inside/outside)

## Future Enhancements

- Email notifications
- SMS alerts
- Visitor photo capture
- Advanced reporting and analytics
- Mobile app integration
- Biometric verification

## License

ISC

