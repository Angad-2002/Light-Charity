# Light Charity Messaging System Setup Guide

## Overview

The Light Charity application now includes a complete messaging system that allows authenticated users to send emails through the dashboard. The system is built with a React frontend and Node.js/Express backend, using Resend for email delivery.

## Features

✅ **Send Individual Messages** - Send emails to specific users by email address
✅ **Broadcast Messages** - Send messages to all users of a specific type (donors/hospitals)
✅ **Form Validation** - Client and server-side validation
✅ **Authentication** - JWT-based user authentication required
✅ **Professional Email Templates** - HTML and text email formats
✅ **Error Handling** - Comprehensive error handling and user feedback
✅ **Toast Notifications** - Real-time feedback for user actions

## Backend Components

### New Files Created:
- `backend/controllers/message.controller.js` - Message handling logic
- `backend/routes/message.routes.js` - API routes for messaging
- `backend/test-message-api.js` - API testing script

### Modified Files:
- `backend/services/email.service.js` - Added `sendGeneralMessage()` method
- `backend/server.js` - Added message routes

## Frontend Components

### Modified Files:
- `frontend/app/dashboard/messages/page.tsx` - Added message sending functionality

## API Endpoints

### Message Routes (`/api/messages`)

1. **POST** `/send` - Send message to specific user
   - **Authentication**: Required (JWT Bearer token)
   - **Body**: `{ to: string, subject: string, message: string }`
   - **Response**: `{ success: boolean, messageId: string }`

2. **POST** `/broadcast` - Send broadcast message
   - **Authentication**: Required (JWT Bearer token)
   - **Body**: `{ subject: string, message: string, recipients?: string[], userType?: 'donor'|'hospital' }`
   - **Response**: `{ success: boolean, stats: { total, sent, failed } }`

3. **GET** `/history` - Get message history (placeholder)
   - **Authentication**: Required (JWT Bearer token)
   - **Response**: `{ success: boolean, data: { messages: [], stats: {} } }`

4. **GET** `/health` - Health check endpoint
   - **Authentication**: Not required
   - **Response**: Service status and available endpoints

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies (if not already done):
```bash
cd backend
npm install
```

#### Configure Environment Variables:
Create a `.env` file in the `backend` directory with the following variables:

```env
# Email Configuration (Required for messaging)
RESEND_API_KEY=your-resend-api-key-here
EMAIL_FROM=Light Charity <noreply@yourdomain.com>

# Database and other existing variables...
MONGODB_URI=mongodb://localhost:27017/light-charity
JWT_SECRET=your-jwt-secret
# ... other existing variables
```

#### Get Resend API Key:
1. Visit [resend.com](https://resend.com)
2. Create account and verify your email
3. Generate API key in the dashboard
4. Add your domain (optional but recommended for production)

#### Start Backend Server:
```bash
cd backend
npm run dev
```

### 2. Frontend Setup

#### Install Dependencies (if not already done):
```bash
cd frontend
npm install
```

#### Configure API URL (Optional):
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Start Frontend Server:
```bash
cd frontend
npm run dev
```

### 3. Test the System

#### Option 1: Use the Test Script
```bash
cd backend
node test-message-api.js
```

#### Option 2: Manual Testing
1. Open http://localhost:3000
2. Login to your account
3. Navigate to Dashboard → Messages
4. Click "New Message"
5. Fill in the form and send

## Usage Guide

### Sending Messages via Dashboard

1. **Login**: Authenticate with your account
2. **Navigate**: Go to Dashboard → Messages
3. **Compose**: Click "New Message" button
4. **Fill Form**:
   - **To**: Enter recipient's email address
   - **Subject**: Enter message subject
   - **Message**: Type your message content
5. **Send**: Click "Send Message" button

### Message Features

- **Validation**: All fields are required and validated
- **Authentication**: Must be logged in to send messages
- **User Verification**: Recipient email must exist in the system
- **Professional Templates**: Emails are sent with Light Charity branding
- **Notifications**: Real-time success/error feedback

## Email Template

Messages are sent with a professional HTML template including:
- Light Charity branding and logo
- Sender information
- Message content with proper formatting
- Professional footer
- Plain text fallback

## Security Features

- **JWT Authentication**: All endpoints require valid authentication
- **Input Validation**: Server-side validation using express-validator
- **Email Verification**: Recipients must exist in the user database
- **Rate Limiting**: Built-in protection through Resend
- **Sanitization**: Content is properly escaped in HTML templates

## Error Handling

The system handles various error scenarios:
- **Authentication errors**: Invalid or missing JWT tokens
- **Validation errors**: Missing or invalid form data
- **Email delivery errors**: Resend API failures
- **Database errors**: User not found scenarios
- **Network errors**: Connection timeouts

## Troubleshooting

### Common Issues:

1. **"Authentication Required" Error**
   - Ensure user is logged in
   - Check JWT token in localStorage
   - Verify token hasn't expired

2. **"Recipient not found" Error**
   - Recipient email must exist in the user database
   - Check email spelling and format

3. **Email Delivery Fails**
   - Verify RESEND_API_KEY is correct
   - Check EMAIL_FROM configuration
   - Ensure domain is verified (for production)

4. **"Failed to send message" Error**
   - Check backend server is running
   - Verify API URL configuration
   - Check browser network tab for details

### Debug Steps:

1. **Check Backend Logs**: Look for error messages in server console
2. **Test API Directly**: Use the test script or Postman
3. **Verify Database**: Ensure MongoDB is running and users exist
4. **Check Email Service**: Test Resend configuration

## Development Notes

### Future Enhancements:
- Message history storage in database
- Message templates and signatures
- File attachments support
- Message scheduling
- Read receipts
- Message threading/conversations

### Performance Considerations:
- Broadcast messages are sent sequentially (could be optimized with queues)
- No rate limiting on frontend (should be added for production)
- Message history is placeholder (needs database implementation)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend console logs
3. Test individual components using the test script
4. Verify all environment variables are correctly set

The messaging system is now fully functional and ready for use! 