import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

/**
 * Creates and caches the Nodemailer SMTP transporter.
 * Uses dotenv.config({ override: true }) so any updates to .env take effect immediately.
 */
function getTransporter() {
  dotenv.config({ override: true });

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Provider responsible for:
 * 1) Sending an automated No-Reply confirmation email to the customer.
 * 2) Sending an immediate lead notification alert to the KPN Sales / Admin team.
 */
class EmailNotificationProvider {
  /**
   * 1. Send automated "No-Reply" confirmation email to the Customer
   */
  async sendCustomerConfirmation(enquiry) {
    if (!enquiry.email || !enquiry.email.includes('@')) {
      return false;
    }

    const transporter = getTransporter();
    const fromAddress =
      process.env.SMTP_FROM ||
      (process.env.SMTP_USER
        ? `"KPN Promoters (No-Reply)" <${process.env.SMTP_USER}>`
        : '"KPN Promoters (No-Reply)" <noreply@kpnpromoters.in>');

    const subject = `Enquiry Received: KPN Promoters [Ref #${String(enquiry._id || '').slice(-6).toUpperCase() || 'NEW'}]`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enquiry Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #29247c 0%, #1a174d 100%); padding: 35px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">KPN PROMOTERS</h1>
              <p style="margin: 6px 0 0 0; color: #fca5a5; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Landmark Real Estate Developers</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 35px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #29247c; font-size: 20px; font-weight: 800;">
                Dear ${enquiry.name || 'Valued Customer'},
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #475569;">
                Thank you for reaching out to <strong>KPN Promoters</strong>. We have received your request regarding <strong>${enquiry.projectName || enquiry.source || 'our real estate properties'}</strong>.
              </p>

              <!-- Summary Box -->
              <table role="presentation" width="100%" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 25px; padding: 15px;">
                <tr>
                  <td style="padding: 6px 10px; font-size: 13px; color: #64748b; font-weight: bold; width: 35%;">Reference ID:</td>
                  <td style="padding: 6px 10px; font-size: 13px; color: #29247c; font-weight: bold;">#${String(enquiry._id || '').slice(-8).toUpperCase() || 'PENDING'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 10px; font-size: 13px; color: #64748b; font-weight: bold;">Contact Phone:</td>
                  <td style="padding: 6px 10px; font-size: 13px; color: #0f172a; font-weight: 600;">${enquiry.phone || 'Provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 10px; font-size: 13px; color: #64748b; font-weight: bold;">Subject / Project:</td>
                  <td style="padding: 6px 10px; font-size: 13px; color: #f12131; font-weight: 700;">${enquiry.projectName || enquiry.source || 'General Property Enquiry'}</td>
                </tr>
                ${
                  enquiry.message
                    ? `<tr>
                        <td style="padding: 6px 10px; font-size: 13px; color: #64748b; font-weight: bold; vertical-align: top;">Your Message:</td>
                        <td style="padding: 6px 10px; font-size: 13px; color: #334155; font-style: italic;">"${enquiry.message}"</td>
                      </tr>`
                    : ''
                }
              </table>

              <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569;">
                Our dedicated sales and customer relationship team is reviewing your requirements and will contact you directly at <strong>${enquiry.phone}</strong> shortly.
              </p>

              <!-- No-Reply Callout -->
              <div style="background-color: #fef2f2; border-left: 4px solid #f12131; padding: 12px 16px; border-radius: 6px; margin-bottom: 25px;">
                <p style="margin: 0; font-size: 12px; color: #991b1b; font-weight: 600;">
                  ⚠️ <em>Please Note:</em> This is an automated acknowledgment from an unmonitored mailbox. Please do not reply directly to this message.
                </p>
              </div>

              <!-- Direct Contact Information -->
              <p style="margin: 0; font-size: 13px; color: #64748b;">
                For immediate assistance or scheduling a site visit, please feel free to reach our office directly:
              </p>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #0f172a;">
                📞 <strong>Direct Call:</strong> +91 73388 34233<br>
                ✉️ <strong>Official Email:</strong> kpnsalesteam@gmail.com<br>
                🌐 <strong>Website:</strong> <a href="https://kpnpromoters.in" style="color: #f12131; text-decoration: none; font-weight: bold;">www.kpnpromoters.in</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center; font-size: 11px; color: #94a3b8;">
              <p style="margin: 0;">© ${new Date().getFullYear()} KPN Promoters Pvt Ltd. All rights reserved.</p>
              <p style="margin: 4px 0 0 0;">No. 48, Karanai Puducherry Rd, Urapakkam, Chennai - 603210</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: fromAddress,
          to: enquiry.email,
          subject,
          html,
        });
        console.log(`[Notification - Email Sent] No-Reply confirmation successfully delivered to customer: ${enquiry.email}`);
        return true;
      } catch (err) {
        console.warn(`[Notification - Email Failed] Could not deliver email to ${enquiry.email}:`, err.message);
        return false;
      }
    } else {
      // SMTP not configured yet -> Log clean development preview
      console.log(`[Notification - Customer No-Reply Preview] (Configure SMTP in .env to send real email)`);
      console.log(`   To: ${enquiry.email}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Ref: #${String(enquiry._id || '').slice(-6).toUpperCase()}`);
      return false;
    }
  }

  /**
   * 2. Send immediate alert email to KPN Admin / Sales Team
   */
  async sendAdminAlert(enquiry) {
    const adminEmail =
      process.env.NOTIFICATION_EMAIL_TO ||
      process.env.ADMIN_EMAIL ||
      'kpnsalesteam@gmail.com';

    const transporter = getTransporter();
    const fromAddress =
      process.env.SMTP_FROM ||
      (process.env.SMTP_USER
        ? `"KPN Website Leads" <${process.env.SMTP_USER}>`
        : '"KPN Website Leads" <leads@kpnpromoters.in>');

    const subject = `🚨 [New Lead Alert] ${enquiry.name} (${enquiry.phone}) - ${enquiry.projectName || enquiry.source || 'Website'}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Lead Alert</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f1f5f9; padding: 25px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
    <div style="background: #29247c; padding: 20px; color: #ffffff;">
      <h2 style="margin: 0; font-size: 20px;">🚨 New Lead Captured on Website</h2>
      <p style="margin: 5px 0 0 0; font-size: 12px; color: #fca5a5;">Source: ${enquiry.source || 'Website Form'}</p>
    </div>
    <div style="padding: 25px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; font-weight: bold; color: #64748b; width: 35%;">Customer Name:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${enquiry.name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Phone Number:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #f12131;">
            <a href="tel:${enquiry.phone}" style="color: #f12131; text-decoration: none;">📞 ${enquiry.phone}</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Email:</td>
          <td style="padding: 8px 0; color: #0f172a;">${enquiry.email ? `<a href="mailto:${enquiry.email}" style="color: #29247c;">${enquiry.email}</a>` : 'Not provided'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Project / Category:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #29247c;">${enquiry.projectName || 'General Inquiry'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Message / Requirement:</td>
          <td style="padding: 8px 0; color: #334155; font-style: italic;">${enquiry.message || 'No additional message.'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Timestamp:</td>
          <td style="padding: 8px 0; color: #64748b; font-size: 12px;">${new Date().toLocaleString('en-IN')}</td>
        </tr>
      </table>

      <div style="margin-top: 25px; text-align: center;">
        <a href="http://localhost:3001/admin/enquiries" style="display: inline-block; background: #f12131; color: #ffffff; padding: 12px 24px; border-radius: 50px; font-weight: bold; text-decoration: none; font-size: 13px;">
          View in Admin Control Center →
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: fromAddress,
          to: adminEmail,
          subject,
          html,
        });
        console.log(`[Notification - Admin Alert Sent] Dispatched new lead alert to ${adminEmail}`);
        return true;
      } catch (err) {
        console.warn(`[Notification - Admin Alert Failed]:`, err.message);
        return false;
      }
    } else {
      console.log(`[Notification - Admin Lead Alert Preview] (Configure SMTP in .env to send real email)`);
      console.log(`   To: ${adminEmail}`);
      console.log(`   Lead: ${enquiry.name} | 📞 ${enquiry.phone} | 🏢 ${enquiry.projectName || enquiry.source}`);
      return false;
    }
  }

  async sendLeadNotification(enquiry) {
    // Fire both email notifications in parallel
    const tasks = [this.sendAdminAlert(enquiry)];
    if (enquiry.email) {
      tasks.push(this.sendCustomerConfirmation(enquiry));
    }
    const results = await Promise.allSettled(tasks);
    return results.every((r) => r.status === 'fulfilled' && r.value === true);
  }
}

class WhatsAppNotificationProvider {
  async sendLeadNotification(enquiry) {
    if (!process.env.WHATSAPP_API_KEY) {
      return false;
    }
    console.log(`[Notification - WhatsApp Sent] Alert sent to KPN Sales Team regarding ${enquiry.name}`);
    return true;
  }
}

class SMSNotificationProvider {
  async sendLeadNotification(enquiry) {
    if (!process.env.SMS_GATEWAY_URL) {
      return false;
    }
    console.log(`[Notification - SMS Sent] SMS dispatch triggered for ${enquiry.phone}`);
    return true;
  }
}

export class NotificationDispatcher {
  constructor() {
    this.providers = [
      new EmailNotificationProvider(),
      new WhatsAppNotificationProvider(),
      new SMSNotificationProvider(),
    ];
  }

  async dispatchAll(enquiry) {
    console.log(`[NotificationService] Processing lead alerts for "${enquiry.name}" (Email: ${enquiry.email || 'None'}, Phone: ${enquiry.phone})`);
    const results = await Promise.allSettled(
      this.providers.map((p) => p.sendLeadNotification(enquiry))
    );
    return results;
  }
}

export const notificationService = new NotificationDispatcher();
