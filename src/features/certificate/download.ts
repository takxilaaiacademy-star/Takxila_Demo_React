import { CERT_H, CERT_W, renderCertificate, type CertificateData } from './renderCertificate';

export type CertificateFormat = 'png' | 'pdf';

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

const baseName = (courseId: string) => `Takxila-certificate-${courseId}`;

/** Saves a sharp (2x) PNG of the certificate. */
export async function downloadCertificatePng(d: CertificateData, courseId: string) {
  const cv = await renderCertificate(d, 2);
  const blob = await new Promise<Blob | null>((r) => cv.toBlob(r, 'image/png'));
  if (!blob) throw new Error('Could not create the PNG');
  save(blob, `${baseName(courseId)}.png`);
}

/** Saves a one-page landscape PDF sized to the certificate (297 x 198 mm). */
export async function downloadCertificatePdf(d: CertificateData, courseId: string) {
  const [{ jsPDF }, cv] = await Promise.all([import('jspdf'), renderCertificate(d, 1.5)]);
  const w = 297;
  const h = Math.round((w * CERT_H) / CERT_W);
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [w, h], compress: true });
  pdf.setProperties({ title: `Takxila certificate - ${d.course}`, author: 'Takxila AI Academy', subject: d.name });
  pdf.addImage(cv.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, w, h, undefined, 'FAST');
  save(pdf.output('blob'), `${baseName(courseId)}.pdf`);
}

export const downloadCertificate = (format: CertificateFormat, d: CertificateData, courseId: string) =>
  format === 'png' ? downloadCertificatePng(d, courseId) : downloadCertificatePdf(d, courseId);
