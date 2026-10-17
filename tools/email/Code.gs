/**
 * TAKXILA email sender: a free Google Apps Script web app that sends the branded HTML emails
 * (order confirmed, enrolled, course completed) from the academy's own Gmail account.
 *
 * SET UP (about 3 minutes, once):
 *  1. Sign in to Google as the academy account (takxila.ai.academy@gmail.com) and open https://script.google.com
 *  2. New project. Delete what is there and paste this whole file into Code.gs. Save (Ctrl+S).
 *  3. Deploy > New deployment > type "Web app".
 *       Execute as: Me        Who has access: Anyone
 *     Deploy, allow the permissions, and copy the Web app URL (ends with /exec).
 *  4. Paste that link in the website: Admin > More > Emails > "Apps Script link" to test at once, and for good
 *     in .env as   VITE_MAIL_WEBHOOK=https://script.google.com/macros/s/XXXX/exec   (or MAIL_WEBHOOK_URL in src/config/site.ts)
 *     then restart "npm run dev" (or rebuild). Admin > Emails shows "Google Apps Script" as the sender.
 *  5. Changed this script later? Deploy > Manage deployments > pencil > Version: New version > Deploy (the link stays the same).
 *
 * Limits: a normal Gmail account can send to about 100 people a day (Google Workspace: 1,500).
 * The web app URL ends up in the website's code, so anyone could call it: the limits below stop it being abused.
 */

const FROM_NAME = 'TAKXILA AI Academy';
const REPLY_TO = 'support@takxila.in';
const MAX_PER_ADDRESS_PER_HOUR = 10;
const MAX_PER_DAY = 90;

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const to = String(d.to || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return reply('bad address');
    if (!d.subject || !d.html) return reply('missing content');

    // Rate limits, so a copied URL cannot be used to spam people.
    const cache = CacheService.getScriptCache();
    const k1 = 'to:' + to.toLowerCase();
    const n1 = Number(cache.get(k1) || 0);
    if (n1 >= MAX_PER_ADDRESS_PER_HOUR) return reply('too many for this address');
    const k2 = 'day:' + new Date().toISOString().slice(0, 10);
    const n2 = Number(cache.get(k2) || 0);
    if (n2 >= MAX_PER_DAY || MailApp.getRemainingDailyQuota() < 1) return reply('daily limit reached');
    cache.put(k1, String(n1 + 1), 3600);
    cache.put(k2, String(n2 + 1), 21600);

    MailApp.sendEmail({
      to: to,
      subject: String(d.subject).slice(0, 200),
      htmlBody: String(d.html),
      body: String(d.text || ''),
      name: FROM_NAME,
      replyTo: REPLY_TO,
    });
    return reply('ok');
  } catch (err) {
    return reply('error: ' + err);
  }
}

function reply(msg) {
  return ContentService.createTextOutput(msg);
}

/** Run this once from the editor (select testSend > Run) to check that mail goes out. */
function testSend() {
  MailApp.sendEmail({ to: Session.getActiveUser().getEmail(), subject: 'TAKXILA email test', htmlBody: '<h2>It works 🎉</h2>', name: FROM_NAME });
}
