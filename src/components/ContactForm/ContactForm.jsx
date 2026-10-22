import './ContactForm.css';
import { useRef, useState } from 'react';
import { contactPayload } from '../../lib/contact';
import emailjs from '@emailjs/browser';
import Window from '../Window/Window';
import Doodle from '../Doodle/Doodle';

const configured = Boolean(import.meta.env.VITE_EMAILJS_SERVICE_ID && import.meta.env.VITE_EMAILJS_TEMPLATE_ID && import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
export default function ContactForm({ form, setForm }) {
  const [sending, setSending] = useState(false);
  const inFlight = useRef(false);
  const lastAttempt = useRef(0);
  const honeypot = useRef(null);
  const [status, setStatus] = useState(null);
  function handleChange(event) { setForm({...form, [event.target.name]:event.target.value}); setStatus(null); }
  async function sendEmail(event) {
    event.preventDefault();
    if (inFlight.current || !configured || honeypot.current?.value) return;
    const payload = contactPayload(form);
    if (!payload) { setStatus({type:'error', text:'Please enter a valid email and message.'}); return; }
    if (Date.now() - lastAttempt.current < 30000) { setStatus({type:'error', text:'Please wait 30 seconds before sending again.'}); return; }
    inFlight.current = true;
    lastAttempt.current = Date.now();
    setSending(true); setStatus(null);
    try {
      await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, payload, {publicKey:import.meta.env.VITE_EMAILJS_PUBLIC_KEY, limitRate:{id:'mind-junk-contact', throttle:30000}});
      setStatus({type:'success', text:'Message sent successfully! :)'});
      setForm({from_email:'',message:''});
    } catch {
      setStatus({type:'error', text:'Something went wrong.'});
    } finally { inFlight.current = false;
      setSending(false); }
  }
  return <section>
    <header className="page-heading"><h1>Contact</h1></header>
    <div className="contact-layout"><Window title="new-message.mail"><form className="contact-form" onSubmit={sendEmail}>
      <div className="contact-honeypot" aria-hidden="true"><label htmlFor="contact-website">Website</label><input ref={honeypot} id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="message-to"><span>To</span><strong>Manaswini</strong></div>
      <label htmlFor="from-email">Your email</label><input id="from-email" type="email" name="from_email" autoComplete="email" placeholder="Your email" required maxLength={254} value={form.from_email} onChange={handleChange} disabled={sending} />
      <label className="sr-only" htmlFor="message">Write your message...</label><textarea id="message" name="message" placeholder="Write your message..." rows={6} maxLength={5000} required value={form.message} onChange={handleChange} disabled={sending} />
      <p className="contact-note">Don't worry, your email won't be displayed anywhere. It will only be used to reply to your message.</p>
      {!configured && <p className="form-status" role="status">Contact form unavailable.</p>}
      {status && <p className={`form-status ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.text}</p>}
      <button className="ui-button" disabled={sending || !configured}>{sending ? 'Sending...' : 'Send'}</button>
    </form></Window><aside className="contact-aside"><Doodle kind="letter" /><p>Have something you'd like to discuss? Whether it's about anything mentioned here or simply saying hello, I'd love to hear from you.</p></aside></div>
  </section>;
}
