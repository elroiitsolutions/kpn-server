import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Op } from 'sequelize';
import EmailJob from '../models/EmailJob.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logoPath = path.resolve(__dirname, '../assets/kpn_logo.png');

/**
 * Returns a configured nodemailer SMTP transporter from current .env variables.
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
 * Helper to get KPN logo attachment config
 */
export function getLogoAttachment() {
  const hasLocal = fs.existsSync(logoPath);
  return hasLocal
    ? [
        {
          filename: 'kpn_logo.png',
          path: logoPath,
          cid: 'kpnlogo',
        },
      ]
    : [];
}

class EmailQueueService {
  constructor() {
    this.isProcessing = false;
    this.timer = null;
  }

  /**
   * Enqueues an email into the database-backed persistent queue.
   * This operation is guaranteed to succeed and survives server restarts.
   */
  async enqueueEmail({ recipient, recipientType = 'customer', subject, htmlContent, metadata = {} }) {
    try {
      const job = await EmailJob.create({
        recipient,
        recipientType,
        subject,
        htmlContent,
        metadata,
        status: 'PENDING',
        retries: 0,
        maxRetries: 3,
      });

      console.log(`[EmailQueue] Enqueued job ${job.id} to ${recipient} (Type: ${recipientType})`);

      // Trigger immediate background processing without blocking caller
      setImmediate(() => {
        this.processQueue().catch((err) => {
          console.warn('[EmailQueue Immediate Error]:', err.message);
        });
      });

      return job;
    } catch (err) {
      console.error('[EmailQueue Enqueue Failed]:', err.message);
      throw err;
    }
  }

  /**
   * Processes pending or retryable failed email jobs.
   */
  async processQueue() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const transporter = getTransporter();
      if (!transporter) {
        // SMTP not configured, keep jobs pending until SMTP is set
        return;
      }

      // Fetch up to 5 jobs that need delivery
      const jobs = await EmailJob.findAll({
        where: {
          [Op.or]: [
            { status: 'PENDING' },
            {
              status: 'FAILED',
              retries: { [Op.lt]: 3 },
            },
          ],
        },
        order: [['createdAt', 'ASC']],
        limit: 5,
      });

      if (jobs.length === 0) {
        return;
      }

      console.log(`[EmailQueue] Processing ${jobs.length} pending email job(s)...`);

      const fromAddress =
        process.env.SMTP_FROM ||
        (process.env.SMTP_USER
          ? `"KPN Promoters" <${process.env.SMTP_USER}>`
          : '"KPN Promoters" <noreply@kpnpromoters.in>');

      const attachments = getLogoAttachment();

      for (const job of jobs) {
        // Mark as PROCESSING
        job.status = 'PROCESSING';
        await job.save();

        try {
          await transporter.sendMail({
            from: fromAddress,
            to: job.recipient,
            subject: job.subject,
            html: job.htmlContent,
            attachments,
          });

          // Delivery successful
          job.status = 'SENT';
          job.sentAt = new Date();
          job.lastError = '';
          await job.save();

          console.log(`[EmailQueue SUCCESS] Delivered job ${job.id} to ${job.recipient}`);
        } catch (sendErr) {
          const newRetries = (job.retries || 0) + 1;
          const isExhausted = newRetries >= job.maxRetries;

          job.retries = newRetries;
          job.status = isExhausted ? 'FAILED' : 'PENDING';
          job.lastError = sendErr.message;
          await job.save();

          console.warn(
            `[EmailQueue RETRY ${newRetries}/${job.maxRetries}] Failed for ${job.recipient}: ${sendErr.message}. Next status: ${job.status}`
          );
        }
      }
    } catch (err) {
      console.warn('[EmailQueue Worker Error]:', err.message);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Starts periodic polling worker for retries and asynchronous batch processing.
   */
  startQueueWorker(intervalMs = 15000) {
    if (this.timer) {
      return;
    }

    console.log(`[EmailQueue Worker] Started background polling every ${intervalMs / 1000}s`);

    // Run initial pass after 3s
    setTimeout(() => {
      this.processQueue().catch(() => {});
    }, 3000);

    this.timer = setInterval(() => {
      this.processQueue().catch((err) => {
        console.warn('[EmailQueue Periodic Worker Error]:', err.message);
      });
    }, intervalMs);
  }

  stopQueueWorker() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const emailQueueService = new EmailQueueService();
export default emailQueueService;
