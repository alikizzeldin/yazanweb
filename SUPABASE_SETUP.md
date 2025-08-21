# Supabase Setup Guide for Inbox Functionality

This guide will help you set up Supabase to enable the inbox functionality on your website.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `yazan-website-inbox` (or any name you prefer)
   - Database Password: Create a strong password
   - Region: Choose the closest to your users
5. Click "Create new project"

## Step 2: Create the Messages Table

Once your project is created, go to the SQL Editor and run this SQL:

```sql
-- Create messages table
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    message_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE NULL
);

-- Create index for better performance
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert messages
CREATE POLICY "Allow public inserts" ON messages
    FOR INSERT WITH CHECK (true);

-- Create policy to allow reading all messages (you can modify this for admin-only access)
CREATE POLICY "Allow public reads" ON messages
    FOR SELECT USING (true);
```

## Step 3: Get Your API Keys

1. Go to Settings → API in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon Public Key** (starts with `eyJ...`)

## Step 4: Update Your Website

1. Open `inbox.js` in your website files
2. Replace the placeholder values at the top of the file:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-public-key';
```

## Step 5: Test the Functionality

1. Open your website and navigate to the Inbox page
2. Try sending a test message
3. Check your Supabase dashboard → Table Editor → messages to see if the message was saved

## Features Included

✅ **Message Form**: Users can send messages with name, email, and content
✅ **Real-time Updates**: New messages appear instantly without refreshing
✅ **Message History**: All messages are displayed with timestamps
✅ **Responsive Design**: Works on mobile and desktop
✅ **Security**: XSS protection and input validation
✅ **Beautiful UI**: Matches your website's space theme

## Optional: Email Notifications

To receive email notifications when someone sends you a message:

1. Go to Supabase Dashboard → Database → Functions
2. Create a new Edge Function for email notifications
3. Set up your email service (SendGrid, Mailgun, etc.)

## Security Notes

- The current setup allows public read/write access to messages
- For production, consider adding authentication for admin access
- You can modify the RLS policies to restrict access as needed

## Troubleshooting

**Messages not loading?**
- Check your browser console for errors
- Verify your Supabase URL and API key are correct
- Ensure the messages table was created successfully

**Can't send messages?**
- Check if RLS policies are set up correctly
- Verify the table structure matches the expected schema
- Check browser console for detailed error messages

## Next Steps

Once everything is working, you can:
- Add message deletion functionality
- Implement read/unread status
- Add message categories or tags
- Create an admin panel for managing messages
- Add email notifications for new messages

Need help? Check the [Supabase documentation](https://supabase.com/docs) or create an issue in your project repository.
