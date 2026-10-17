/**
 * Branded emails sent to learners: course purchase, free enrolment, and course completion
 * (a congratulations greeting with the certificate). Edit the words here.
 *
 * Emails are plain HTML tables with inline styles, which is what Gmail, Outlook and phone mail apps render reliably.
 * Images need a full web address, so the logo comes from your live site (VITE_SITE_URL, or the address the app runs on).
 */

export type EmailKind = "purchase" | "enroll" | "completed";

export interface EmailCourse {
  id: string;
  title: string;
  meta?: string;
  price?: number;
}

export interface EmailData {
  name: string;
  /** Site address used for the logo and buttons, e.g. https://takxila.in */
  site: string;
  courses: EmailCourse[];
  orderId?: string;
  paymentId?: string;
  total?: number;
  /** Completion email */
  certificateId?: string;
  lessons?: number;
  date?: string;
  next?: EmailCourse[];
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const NAVY = "#0B1636";
const GOLD = "#F5B93F";
const INDIGO = "#4F6BFF";
const INK = "#1E2433";
const MUTED = "#5B6478";
const LINE = "#E6E8F0";
const SUPPORT_EMAIL = "support@takxila.in";
const WHATSAPP = "+91 72766 07776";
const FONT =
  "'Plus Jakarta Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const first = (name: string) => esc(name.trim().split(/\s+/)[0] || "there");
const rupees = (n: number) =>
  n === 0 ? "Free" : "₹" + n.toLocaleString("en-IN");

function button(href: string, label: string, color = GOLD, ink = NAVY) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px auto 4px"><tr><td align="center" bgcolor="${color}" style="border-radius:999px">
  <a href="${href}" target="_blank" style="display:inline-block;padding:14px 34px;font-family:${FONT};font-size:15px;font-weight:800;color:${ink};text-decoration:none;border-radius:999px">${label}</a>
</td></tr></table>`;
}

function courseRows(list: EmailCourse[], site: string, withPrice: boolean) {
  return list
    .map(
      (c) => `<tr>
  <td style="padding:14px 0;border-bottom:1px solid ${LINE}">
    <a href="${site}/courses/${encodeURIComponent(c.id)}" style="font-family:${FONT};font-size:15px;font-weight:700;color:${INK};text-decoration:none">${esc(c.title)}</a>
    ${c.meta ? `<div style="font-family:${FONT};font-size:12.5px;color:${MUTED};margin-top:3px">${esc(c.meta)}</div>` : ""}
  </td>
  ${withPrice ? `<td align="right" style="padding:14px 0 14px 12px;border-bottom:1px solid ${LINE};font-family:${FONT};font-size:15px;font-weight:700;color:${INK};white-space:nowrap">${rupees(c.price ?? 0)}</td>` : ""}
</tr>`,
    )
    .join("");
}

/** The shared frame: navy header with the logo, white card, footer with support details. */
function layout(site: string, preheader: string, hero: string, body: string) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only">
<title>TAKXILA AI Academy</title></head>
<body style="margin:0;padding:0;background:#EEF0F7">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EEF0F7"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;border-radius:20px;overflow:hidden;background:#FFFFFF;box-shadow:0 10px 30px rgba(11,22,54,.12)">
  <tr><td align="center" bgcolor="${NAVY}" style="background:${NAVY};background-image:linear-gradient(135deg,#0B1636 0%,#13215e 60%,#2a2f8f 100%);padding:30px 24px 26px">
    <a href="${site}" target="_blank"><img src="${site}/assets/email/logo.png" width="176" alt="TAKXILA AI Academy" style="display:block;border:0;width:176px;max-width:176px;height:auto"></a>
    ${hero}
  </td></tr>
  <tr><td style="padding:30px 32px 10px;font-family:${FONT};color:${INK}">${body}</td></tr>
  <tr><td style="padding:6px 32px 30px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-left:4px solid ${GOLD};background:#FFF8E6;border-radius:10px;padding:14px 18px;font-family:${FONT};font-size:14px;font-weight:700;color:${INK}">
      Tools may change. Frameworks stay. <span style="color:${MUTED};font-weight:500">Keep practising, a few minutes every day.</span>
    </td></tr></table>
  </td></tr>
  <tr><td align="center" bgcolor="#F6F7FB" style="padding:22px 28px;border-top:1px solid ${LINE};font-family:${FONT};font-size:12.5px;line-height:1.7;color:${MUTED}">
    <div style="font-weight:800;color:${INK};font-size:14px">TAKXILA™ AI Academy</div>
    Master the AI frameworks. Own the AI future.<br>
    Questions? Reply to this email, write to <a href="mailto:${SUPPORT_EMAIL}" style="color:${INDIGO}">${SUPPORT_EMAIL}</a> or WhatsApp ${WHATSAPP}.<br>
    <a href="${site}/my-courses" style="color:${INDIGO}">My courses</a> · <a href="${site}/certificates" style="color:${INDIGO}">Certificates</a> · <a href="${site}/preferences" style="color:${INDIGO}">Email preferences</a>
  </td></tr>
</table>
<div style="font-family:${FONT};font-size:11px;color:#9AA1B2;padding-top:14px">You are receiving this because you have an account at TAKXILA AI Academy.</div>
</td></tr></table>
</body></html>`;
}

const heroBlock = (kicker: string, title: string, sub: string) => `
    <div style="font-family:${FONT};font-size:12px;letter-spacing:3px;font-weight:800;color:${GOLD};margin-top:22px">${kicker}</div>
    <div style="font-family:${FONT};font-size:28px;line-height:1.2;font-weight:800;color:#FFFFFF;margin-top:8px">${title}</div>
    <div style="font-family:${FONT};font-size:15px;line-height:1.6;color:#C9D0EA;margin-top:8px">${sub}</div>`;

function purchase(d: EmailData, free: boolean): RenderedEmail {
  const n = d.courses.length;
  const what = n === 1 ? d.courses[0].title : `${n} courses`;
  const subject = free
    ? `You're enrolled: ${what} 🎓`
    : `Welcome aboard! Your order ${d.orderId ?? ""} is confirmed 🎉`.replace(
        "  ",
        " ",
      );
  const hero = heroBlock(
    free ? "ENROLMENT CONFIRMED" : "PAYMENT SUCCESSFUL",
    `You're in, ${first(d.name)}! 🎉`,
    free
      ? "Your free course is unlocked and waiting for you."
      : "Thank you for learning with TAKXILA. Your courses are unlocked.",
  );
  const summary = free
    ? ""
    : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:4px">
  <tr><td style="font-family:${FONT};font-size:15px;font-weight:800;color:${INK};padding-top:14px">Total paid</td><td align="right" style="font-family:${FONT};font-size:20px;font-weight:800;color:${INK};padding-top:14px">${rupees(d.total ?? 0)}</td></tr>
  <tr><td colspan="2" style="font-family:${FONT};font-size:12.5px;color:${MUTED};padding-top:4px">Order ${esc(d.orderId ?? "")}${d.paymentId ? " · Payment ID " + esc(d.paymentId) : ""} · ${esc(d.date ?? "")}</td></tr>
</table>`;
  const body = `
<p style="margin:0 0 14px;font-size:16px;line-height:1.7">Hi ${first(d.name)},</p>
<p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:${MUTED}">Welcome to a smarter way of learning AI. ${free ? "You have been enrolled in" : "Your payment went through and you now have lifetime access to"} the ${n === 1 ? "course" : "courses"} below. Every lesson is hands-on, so you will be <b style="color:${INK}">using AI from day one</b>, not just watching it.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:2px solid ${INK};margin:18px 0 6px">${courseRows(d.courses, d.site, !free)}</table>
${summary}
<div style="text-align:center;padding:26px 0 8px">${button(d.site + (n === 1 ? "/courses/" + encodeURIComponent(d.courses[0].id) : "/my-courses"), "Start learning →")}</div>
<p style="margin:16px 0 6px;font-size:14px;line-height:1.7;color:${MUTED}"><b style="color:${INK}">How to get the most out of it:</b></p>
<ul style="margin:0 0 16px;padding-left:20px;font-size:14px;line-height:1.8;color:${MUTED}">
  <li>Block 20 minutes a day. Small, steady practice beats weekend marathons.</li>
  <li>Try every prompt and exercise yourself, then apply it to your own work.</li>
  <li>Finish all lessons to unlock your <b style="color:${INK}">verified certificate</b>.</li>
</ul>
<p style="margin:0 0 6px;font-size:15px;line-height:1.7">Happy learning,<br><b>Team TAKXILA</b></p>`;
  const start = d.site + (n === 1 ? "/courses/" + encodeURIComponent(d.courses[0].id) : "/my-courses");
  const text = [
    `Hi ${d.name.trim().split(/\s+/)[0] || "there"},`,
    "",
    free ? `🎓 You're enrolled! Your free course is unlocked.` : `🎉 Your order ${d.orderId ?? ""} is confirmed. Welcome to TAKXILA AI Academy!`,
    "",
    n === 1 ? "YOUR COURSE" : "YOUR COURSES",
    ...d.courses.map((c) => "• " + c.title + (free ? "" : " — " + rupees(c.price ?? 0))),
    ...(free ? [] : ["", `Total paid: ${rupees(d.total ?? 0)}`, `Order ${d.orderId ?? ""}${d.paymentId ? " · Payment ID " + d.paymentId : ""}${d.date ? " · " + d.date : ""}`]),
    "",
    `▶ Start learning: ${start}`,
    "",
    "How to get the most out of it",
    "• Block 20 minutes a day. Small, steady practice beats weekend marathons.",
    "• Try every prompt and exercise yourself, then apply it to your own work.",
    "• Finish all lessons to unlock your verified certificate.",
    "",
    `Questions? Reply to this email, write to ${SUPPORT_EMAIL} or WhatsApp ${WHATSAPP}.`,
    "",
    "Happy learning,",
    "Team TAKXILA",
  ].join("\n");
  return {
    subject,
    html: layout(
      d.site,
      free
        ? `Your free course ${what} is ready.`
        : `Order confirmed: ${what}. Start learning today.`,
      hero,
      body,
    ),
    text,
  };
}

function completed(d: EmailData): RenderedEmail {
  const c = d.courses[0];
  const subject = `Congratulations, ${d.name.split(" ")[0]}! You completed ${c.title} 🏆`;
  const hero = heroBlock(
    "COURSE COMPLETED",
    `Congratulations, ${first(d.name)}! 🏆`,
    "You did it. Your certificate is ready.",
  );
  const stat = (v: string, l: string, size = 20) =>
    `<td align="center" width="33%" style="padding:14px 6px;background:#F6F7FB;border-radius:12px"><div style="font-family:${FONT};font-size:${size}px;font-weight:800;color:${INK}">${v}</div><div style="font-family:${FONT};font-size:12px;color:${MUTED};margin-top:2px">${l}</div></td>`;
  const next = (d.next ?? []).slice(0, 2);
  const body = `
<p style="margin:0 0 14px;font-size:16px;line-height:1.7">Dear ${first(d.name)},</p>
<p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:${MUTED}">What an achievement! You have successfully completed <b style="color:${INK}">${esc(c.title)}</b>. Every lesson you finished, every prompt you tried and every exercise you practised has moved you from knowing about AI to <b style="color:${INK}">actually using it</b>. The whole TAKXILA team is proud of you.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="6" border="0" style="margin:10px 0 18px"><tr>
  ${stat(String(d.lessons ?? "✓"), "lessons done")}${stat("100%", "final grade")}${stat(esc(d.date ?? ""), "completed on", 15)}
</tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:2px dashed ${GOLD};border-radius:16px"><tr><td align="center" style="padding:22px 18px">
  <div style="font-size:34px;line-height:1">🎓</div>
  <div style="font-family:${FONT};font-size:18px;font-weight:800;color:${INK};margin-top:8px">Your Certificate of Completion is ready</div>
  <div style="font-family:${FONT};font-size:13px;color:${MUTED};margin-top:6px">Certificate ID <b style="color:${INK};letter-spacing:1px">${esc(d.certificateId ?? "")}</b> · Download it as PNG or PDF</div>
  <div style="padding-top:14px">${button(d.site + "/certificates", "Download my certificate")}</div>
  <div style="font-family:${FONT};font-size:12.5px;color:${MUTED};margin-top:8px">Share it on LinkedIn and tag <b>TAKXILA AI Academy</b>. We love to celebrate our learners!</div>
</td></tr></table>
${
  next.length
    ? `<p style="margin:26px 0 4px;font-size:15px;font-weight:800">Keep the momentum going</p>
<p style="margin:0 0 4px;font-size:14px;line-height:1.7;color:${MUTED}">Learners who finished this course also loved:</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${courseRows(next, d.site, true)}</table>`
    : ""
}
<p style="margin:22px 0 6px;font-size:15px;line-height:1.7">With warm wishes for everything you build next,<br><b>Team TAKXILA</b></p>`;
  const text = [
    `Dear ${d.name.trim().split(/\s+/)[0] || "there"},`,
    "",
    `🏆 Congratulations! You have completed ${c.title}.`,
    "",
    `Your Certificate of Completion is ready (ID ${d.certificateId ?? ""}).`,
    `▶ Download it: ${d.site}/certificates`,
    "",
    "Share it on LinkedIn and tag TAKXILA AI Academy. We love to celebrate our learners!",
    ...(next.length ? ["", "Keep the momentum going:", ...next.map((x) => `• ${x.title} — ${d.site}/courses/${encodeURIComponent(x.id)}`)] : []),
    "",
    `Questions? Reply to this email, write to ${SUPPORT_EMAIL} or WhatsApp ${WHATSAPP}.`,
    "",
    "With warm wishes,",
    "Team TAKXILA",
  ].join("\n");
  return {
    subject,
    html: layout(
      d.site,
      `You completed ${c.title}. Your certificate is ready to download.`,
      hero,
      body,
    ),
    text,
  };
}

export function renderEmail(kind: EmailKind, d: EmailData): RenderedEmail {
  return kind === "completed" ? completed(d) : purchase(d, kind === "enroll");
}
