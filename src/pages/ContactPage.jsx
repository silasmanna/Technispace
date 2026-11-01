import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Message Sent!', 'Our support team in Lagos will respond within 4 hours.');
  };

  return (
    <div style={{ paddingTop: 104, paddingBottom: 80 }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 50px' }}>
          <span className="badge badge-primary" style={{ marginBottom: 14 }}>
            Direct Support
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 12 }}>
            We're Here to Help
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Have a question about KYC verification, listing your property, or finding your next home? Reach out directly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 36, maxWidth: 1050, margin: '0 auto' }}>
          {/* Contact Details */}
          <div>
            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: 32,
              marginBottom: 24,
            }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 20 }}>Direct Channels</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(108, 71, 255, 0.12)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMAIL US</div>
                    <a href="mailto:hello@technipal.com.ng" style={{ color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'none' }}>
                      hello@technipal.com.ng
                    </a>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>General queries & partner inquiries</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>HOTLINE & WHATSAPP</div>
                    <a href="tel:+2348008324647" style={{ color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'none' }}>
                      +234 800 TECHNISPACE (+234 803 900 1200)
                    </a>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>Mon – Sat, 8:00 AM – 6:00 PM WAT</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>HEADQUARTERS</div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                      Level 4, Landmark Towers, Water Corporation Drive, Victoria Island, Lagos, Nigeria
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: 'var(--accent-teal)' }}>
                <Clock size={16} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Fast Response Time</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                Our Lagos-based verification team reviews all KYC documents, landlord ownership deeds, and customer tickets within 4 hours during business days.
              </p>
            </div>
          </div>

          {/* Form */}
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: 36,
            boxShadow: 'var(--shadow-md)',
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Send a Message</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
              Fill out this form and our support desk will follow up promptly.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <CheckCircle size={48} color="var(--accent-teal)" style={{ marginBottom: 16 }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>Thank You!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 24 }}>
                  Your inquiry has been received. A support specialist has been assigned to your ticket.
                </p>
                <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: 'General Inquiry', message: '' }); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Adebayo Ogunlesi"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@domain.ng"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Landlord KYC Verification">Landlord KYC Verification</option>
                    <option value="Listing Support & Upgrades">Listing Support & Upgrades</option>
                    <option value="Report Suspicious Activity">Report Suspicious Activity</option>
                    <option value="Partnership & Press">Partnership & Press</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 24 }}>
                  <label className="form-label">Your Message</label>
                  <textarea
                    className="form-input form-textarea"
                    rows={5}
                    placeholder="Describe how we can assist you..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: 8 }}>
                  <Send size={16} /> Submit Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
