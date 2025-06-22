# Volunteer Application API Setup Guide

This guide explains how to set up and use the volunteer application API that stores submissions in MongoDB.

## What's Been Created

### Backend Components

1. **MongoDB Model** (`backend/models/volunteer.model.js`)
   - Fields: firstName, lastName, email, phone, interests[], availability[], message, status, applicationDate, contactedDate, notes
   - Validation and indexing for optimal performance

2. **Controller** (`backend/controllers/volunteer.controller.js`)
   - `submitApplication`: Handle new volunteer applications
   - `getAllApplications`: Get paginated list of applications with filtering
   - `getApplicationById`: Get single application details
   - `updateApplicationStatus`: Update application status and notes
   - `getVolunteerStats`: Get application statistics

3. **Routes** (`backend/routes/volunteer.routes.js`)
   - `POST /api/volunteer/apply` - Submit new application
   - `GET /api/volunteer/applications` - Get all applications (admin)
   - `GET /api/volunteer/applications/stats` - Get statistics (admin)
   - `GET /api/volunteer/applications/:id` - Get single application (admin)
   - `PUT /api/volunteer/applications/:id/status` - Update status (admin)

4. **Validation**
   - Express-validator for input validation
   - Email format validation
   - Phone number validation
   - Interest and availability option validation

### Frontend Components

1. **Volunteer Application Form** (`frontend/components/volunteer/volunteer-application-form.tsx`)
   - React form with state management
   - Real-time API submission
   - Toast notifications for success/error
   - Form validation and loading states

2. **Volunteer Dashboard** (`frontend/app/dashboard/volunteers/page.tsx`)
   - View all volunteer applications
   - Filter by status (pending, contacted, approved, rejected)
   - Update application status
   - Statistics dashboard
   - Responsive design

## API Endpoints

### Public Endpoints

#### Submit Volunteer Application
```
POST /api/volunteer/apply
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "phone": "+1234567890",
  "interests": ["Event Support", "Outreach"],
  "availability": ["Weekends", "Evenings"],
  "message": "I want to help save lives in my community."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Volunteer application submitted successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "applicationDate": "2024-01-20T10:30:00.000Z"
  }
}
```

### Admin Endpoints

#### Get All Applications
```
GET /api/volunteer/applications?status=pending&page=1&limit=10
```

#### Get Application Statistics
```
GET /api/volunteer/applications/stats
```

#### Update Application Status
```
PUT /api/volunteer/applications/:id/status
Content-Type: application/json

{
  "status": "contacted",
  "notes": "Initial contact made via phone"
}
```

## Setup Instructions

### 1. Environment Variables

Make sure your backend has MongoDB connection configured in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/light-charity
```

For frontend, create `.env.local` if needed:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 2. Install Dependencies

The required dependencies are already in `package.json`:
- `express-validator` for validation
- `mongoose` for MongoDB operations

### 3. Start the Services

1. Start MongoDB service
2. Start backend server: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`

### 4. Test the API

Run the test script to verify everything works:
```bash
cd backend
node test-volunteer-api.js
```

## Form Fields

The volunteer application form collects:

### Required Fields
- First Name (2-50 characters, letters only)
- Last Name (2-50 characters, letters only)
- Email (valid email format)
- Phone (valid phone number)

### Optional Fields
- Areas of Interest (checkboxes):
  - Event Support
  - Office Support
  - Outreach
  - Logistics
  - Donor Relations
  - Marketing

- Availability (checkboxes):
  - Weekdays
  - Weekends
  - Mornings
  - Afternoons
  - Evenings

- Message (up to 1000 characters)

## Application Status Flow

1. **pending** - Initial submission
2. **contacted** - Organization has reached out
3. **approved** - Application accepted
4. **rejected** - Application declined

## Database Schema

```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  phone: String (required),
  interests: [String], // enum values
  availability: [String], // enum values
  message: String,
  status: String (enum: pending/contacted/approved/rejected),
  applicationDate: Date (auto-generated),
  contactedDate: Date,
  notes: String,
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Duplicate email prevention (400)
- Database errors (500)
- Network errors with user-friendly messages

## Security Considerations

- Input validation on all fields
- Email normalization
- Protection against duplicate submissions
- Admin endpoints should be protected with authentication (recommended addition)

## Next Steps

Consider adding:
1. Authentication middleware for admin endpoints
2. Email notifications when applications are submitted
3. File upload for resumes/certificates
4. Application export functionality
5. Volunteer scheduling system
6. Automated follow-up reminders 