# Email Notification Setup Guide

This guide explains how to set up email notifications for lesson request acceptance/rejection.

## 1. Install NodeMailer

Run this command in your project directory:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

## 2. Configure Environment Variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Or manually add these lines to your `.env.local` file:

```env
# Email Configuration (NodeMailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Get Gmail App Password (Recommended)

If using Gmail, follow these steps:

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication (if not already enabled)
3. Go back to Security settings
4. Look for "App passwords" option
5. Select "Mail" and "Windows Computer"
6. Google will generate a 16-character password
7. Copy and paste this password as `EMAIL_PASSWORD` in your `.env.local`

⚠️ **Never use your actual Gmail password!** Always use the App Password.

## 4. Alternative Email Services

You can use other email services by updating the configuration in `app/lib/mailer.ts`:

### SendGrid
```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

### AWS SES
```typescript
const transporter = nodemailer.createTransport({
  ses: new AWS.SES({ region: 'us-east-1' })
});
```

### Custom SMTP
```typescript
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## 5. How It Works

### When Teacher Accepts a Request:
- Student receives an email with subject: "✓ Your Lesson Request Approved"
- Email contains lesson time and link to dashboard
- Professional branded HTML template

### When Teacher Rejects a Request:
- Student receives an email with subject: "Update on Your Lesson Request"
- Email includes optional rejection reason
- Encourages student to try other teachers

## 6. Testing in Development

If you don't have Gmail configured, the app will use **Ethereal Email** (free testing service):
- Emails won't actually be sent
- Preview URLs provided in console for testing
- Perfect for development without real email setup

## 7. Email Template Customization

Edit `app/lib/mailer.ts` to customize:
- Email subject lines
- HTML template design
- Sender name and address
- Brand colors and styling

## 8. Troubleshooting

### "Could not connect to mail server"
- Check EMAIL_USER and EMAIL_PASSWORD in `.env.local`
- Verify Gmail App Password (not regular password)
- Enable "Less Secure App Access" if not using App Password

### "SMTP Error"
- Ensure 2-Factor Authentication is enabled on Gmail
- Generate a new App Password
- Check that `.env.local` is loaded (restart dev server)

### Emails not sending in production
- Update `NEXT_PUBLIC_APP_URL` to your live domain
- Ensure environment variables are set in your hosting provider
- Check email logs in the server console

## 9. Error Handling

The system has built-in error handling:
- If email fails to send, the request is still processed (accept/reject happens)
- Warning logged to console about email failure
- User sees "Request accepted/rejected" even if email fails
- Consider this when implementing in production

## 10. Security Best Practices

✅ **Do:**
- Use App Passwords instead of real passwords
- Store credentials in `.env.local` (not in code)
- Use HTTPS in production
- Validate email addresses before sending

❌ **Don't:**
- Commit `.env.local` to git (use `.gitignore`)
- Use plain text passwords in code
- Send emails without user consent
- Expose SMTP credentials to client-side code

## Support

For issues with NodeMailer, visit: https://nodemailer.com/
For Gmail authentication help: https://support.google.com/accounts/answer/185833
