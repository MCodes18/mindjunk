// Browser-side validation reduces mistakes; EmailJS must enforce abuse controls.
export function contactPayload(form) {
  const email = typeof form?.from_email === 'string' ? form.from_email.trim() : '';
  const message = typeof form?.message === 'string' ? form.message.trim() : '';
  if (!email || email.length > 254 || (/[\r\n]/.test(email) || email.includes('\0')) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (!message || message.length > 5000 || message.includes('\0')) return null;
  // Never forward arbitrary form keys (recipient, subject, etc.) to the template.
  return { from_email: email, message };
}
