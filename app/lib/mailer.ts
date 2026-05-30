import nodemailer from "nodemailer";

// Create a transporter using Gmail (you can change to your email service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Fallback transporter if Gmail env vars not set (for testing)
const testTransporter = nodemailer.createTestAccount().then((testAccount) => {
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    // Use real Gmail if credentials available, otherwise use test transporter
    const mail = process.env.EMAIL_USER 
      ? transporter 
      : await testTransporter;

    const result = await mail.sendMail({
      from: process.env.EMAIL_USER || '"Virtuoso Learning" <noreply@virtuoso.local>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Helper function to send lesson request acceptance email
export async function sendLessonAcceptanceEmail(
  studentEmail: string,
  studentName: string,
  teacherName: string,
  lessonTime?: string
) {
  return sendEmail({
    to: studentEmail,
    subject: `✓ Your Lesson Request Approved - Virtuoso Learning`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎵 Lesson Accepted!</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
          <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
            Hi <strong>${studentName}</strong>,
          </p>
          
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
            Great news! <strong>${teacherName}</strong> has accepted your lesson request. 
            Your one-time tutor review is now scheduled.
          </p>
          
          ${lessonTime ? `
            <div style="background: white; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #666; margin: 0;"><strong>Scheduled Time:</strong></p>
              <p style="color: #333; font-size: 16px; margin: 5px 0 0 0;">${lessonTime}</p>
            </div>
          ` : ''}
          
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 20px 0;">
            Please prepare your audio recording and be ready at the scheduled time.
            If you have any questions, you can reach out to your teacher directly.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/student" 
              style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; text-align: center;">
            This is an automated message from Virtuoso Learning. Please don't reply to this email.
          </p>
        </div>
      </div>
    `,
    text: `Hi ${studentName},\n\nGreat news! ${teacherName} has accepted your lesson request. Your one-time tutor review is now scheduled.\n\nPlease prepare your audio recording and be ready at the scheduled time.\n\nBest regards,\nVirtuoso Learning Team`,
  });
}

// Helper function to send lesson request rejection email
export async function sendLessonRejectionEmail(
  studentEmail: string,
  studentName: string,
  teacherName: string,
  reason?: string
) {
  return sendEmail({
    to: studentEmail,
    subject: `Update on Your Lesson Request - Virtuoso Learning`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📝 Lesson Status Update</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
          <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
            Hi <strong>${studentName}</strong>,
          </p>
          
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
            Thank you for submitting your audio for review. Unfortunately, <strong>${teacherName}</strong> is unable to review your submission at this time.
          </p>
          
          ${reason ? `
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #666; margin: 0;"><strong>Reason:</strong></p>
              <p style="color: #333; font-size: 15px; margin: 5px 0 0 0;">${reason}</p>
            </div>
          ` : ''}
          
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 20px 0;">
            We encourage you to try booking with another teacher or check back soon. 
            Keep practicing and improving your skills!
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/student" 
              style="background: #475569; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              View Available Teachers
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; text-align: center;">
            This is an automated message from Virtuoso Learning. Please don't reply to this email.
          </p>
        </div>
      </div>
    `,
    text: `Hi ${studentName},\n\nThank you for submitting your audio for review. Unfortunately, ${teacherName} is unable to review your submission at this time.\n\n${reason ? `Reason: ${reason}\n\n` : ''}We encourage you to try booking with another teacher or check back soon.\n\nBest regards,\nVirtuoso Learning Team`,
  });
}

export async function sendBookingNotificationEmailToStudent(
  studentEmail: string,
  studentName: string,
  tutorName: string,
  tutorEmail: string,
  tutorContact: string,
  bookingTime: string | Date | null,
  amountPaid: number
) {
  return sendEmail({
    to: studentEmail,
    subject: `Your lesson booking is confirmed - ${tutorName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #101010; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px;">Booking Confirmed</h1>
        </div>
        <div style="background: #fff; padding: 30px; border-radius: 0 0 10px 10px; color: #111; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px;">Hi ${studentName},</p>
          <p style="font-size: 16px; line-height: 1.6;">Your lesson booking with <strong>${tutorName}</strong> is confirmed.</p>
          <p style="font-size: 16px; line-height: 1.6;">Tutor contact: <strong>${tutorEmail}</strong></p>
          <p style="font-size: 16px; line-height: 1.6;">Tutor phone/website: <strong>${tutorContact}</strong></p>
          ${bookingTime ? `<p style="font-size: 16px; line-height: 1.6;">Scheduled for: <strong>${new Date(bookingTime).toLocaleString()}</strong></p>` : ''}
          <p style="font-size: 16px; line-height: 1.6;">Amount paid: <strong>Rs. ${amountPaid}</strong></p>
          <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">Please keep the tutor details handy and reach out if you need to reschedule.</p>
        </div>
      </div>
    `,
    text: `Hi ${studentName},\n\nYour lesson booking with ${tutorName} is confirmed.\nTutor contact: ${tutorEmail}\nTutor phone/website: ${tutorContact}\n${bookingTime ? `Scheduled for: ${new Date(bookingTime).toLocaleString()}\n` : ''}Amount paid: Rs. ${amountPaid}\n\nPlease reach out to your tutor if you need to reschedule.`,
  });
}

export async function sendBookingNotificationEmailToTutor(
  tutorEmail: string,
  tutorName: string,
  studentName: string,
  studentEmail: string,
  bookingTime: string | Date | null,
  studentContact: string,
  amountPaid: number,
  message?: string
) {
  return sendEmail({
    to: tutorEmail,
    subject: `New lesson booking from ${studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #101010; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px;">New Booking Received</h1>
        </div>
        <div style="background: #fff; padding: 30px; border-radius: 0 0 10px 10px; color: #111; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px;">Hi ${tutorName},</p>
          <p style="font-size: 16px; line-height: 1.6;">You have a new booking request from <strong>${studentName}</strong>.</p>
          <p style="font-size: 16px; line-height: 1.6;">Student email: <strong>${studentEmail}</strong></p>
          <p style="font-size: 16px; line-height: 1.6;">Student contact: <strong>${studentContact}</strong></p>
          ${bookingTime ? `<p style="font-size: 16px; line-height: 1.6;">Scheduled for: <strong>${new Date(bookingTime).toLocaleString()}</strong></p>` : ''}
          <p style="font-size: 16px; line-height: 1.6;">Amount paid: <strong>Rs. ${amountPaid}</strong></p>
          ${message ? `<p style="font-size: 16px; line-height: 1.6;">Student message: <strong>${message}</strong></p>` : ''}
          <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">Please contact the student to confirm the session details.</p>
        </div>
      </div>
    `,
    text: `Hi ${tutorName},\n\nYou have a new booking request from ${studentName}.\nStudent email: ${studentEmail}\nStudent contact: ${studentContact}\n${bookingTime ? `Scheduled for: ${new Date(bookingTime).toLocaleString()}\n` : ''}Amount paid: Rs. ${amountPaid}\n${message ? `Student message: ${message}\n` : ''}\nPlease contact the student to confirm the session details.`,
  });
}
