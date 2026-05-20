const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Application = require('../models/Application');
const User = require('../models/User');

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

const sendReminderEmail = async (transporter, user, applications) => {
  const appList = applications
    .map((a) => `• ${a.company} — ${a.role} (Deadline: ${new Date(a.deadline).toDateString()})`)
    .join('\n');

  await transporter.sendMail({
    from: `"InternIQ" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: `⏰ Upcoming Deadlines — ${applications.length} application(s) due soon`,
    text: `Hi ${user.name},\n\nYou have upcoming application deadlines:\n\n${appList}\n\nLog in to InternIQ to manage them.\n\nGood luck! 🎓`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #3461f5;">⏰ Upcoming Deadlines</h2>
        <p>Hi ${user.name},</p>
        <p>You have <strong>${applications.length}</strong> application deadline(s) coming up:</p>
        <ul style="line-height: 2;">
          ${applications.map((a) => `<li><strong>${a.company}</strong> — ${a.role}<br><small>Due: ${new Date(a.deadline).toDateString()}</small></li>`).join('')}
        </ul>
        <p>Log in to <a href="${process.env.CLIENT_URL}" style="color:#3461f5">InternIQ</a> to manage them.</p>
        <p>Good luck! 🎓</p>
      </div>
    `,
  });
};

const startReminderJob = () => {
  // Runs every day at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    const transporter = createTransporter();
    if (!transporter) return; // Email not configured

    try {
      const users = await User.find({ 'preferences.emailReminders': true });

      for (const user of users) {
        const daysAhead = user.preferences.reminderDays || 3;
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysAhead);

        const upcoming = await Application.find({
          user: user._id,
          deadline: {
            $gte: new Date(),
            $lte: targetDate,
          },
          status: { $nin: ['Rejected', 'Withdrawn', 'Offer'] },
          reminderSent: false,
        });

        if (upcoming.length > 0) {
          await sendReminderEmail(transporter, user, upcoming);
          await Application.updateMany(
            { _id: { $in: upcoming.map((a) => a._id) } },
            { reminderSent: true }
          );
          console.log(`📧 Sent deadline reminder to ${user.email} (${upcoming.length} apps)`);
        }
      }
    } catch (err) {
      console.error('Reminder cron error:', err.message);
    }
  });

  console.log('⏰ Reminder cron job scheduled (daily 8AM)');
};

module.exports = { startReminderJob };
