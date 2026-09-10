'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Building, ShieldCheck, Send, CheckCircle2, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#111', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top Header Nav */}
      <header style={{ borderBottom: '1px solid #eaeaea', padding: '16px 24px', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <img src="/icon.png" alt="ProfitupX" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
            <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#000', letterSpacing: '-0.5px' }}>ProfitupX</span>
          </Link>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.88rem', fontWeight: 600 }}>
            <Link href="/" style={{ color: '#555', textDecoration: 'none' }}>Home</Link>
            <Link href="/about" style={{ color: '#555', textDecoration: 'none' }}>About</Link>
            <Link href="/pricing" style={{ color: '#555', textDecoration: 'none' }}>Pricing</Link>
            <Link href="/contact" style={{ color: '#000', fontWeight: 800, textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '50px 24px 80px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', marginBottom: '32px', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div style={{ marginBottom: '40px' }}>
          <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '100px', background: '#e0f2fe', color: '#0369a1', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Official Support & Office
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#000', marginBottom: '12px' }}>
            Contact Us
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '650px', lineHeight: 1.6 }}>
            Have questions about your order, creator payouts, or platform integration? Reach out to our verified merchant support desk.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
          {/* Left: Verified Legal Entity Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Legal Entity Card */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Legal Business Information</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Registered Merchant for Payment Gateway</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Building size={18} color="#0284c7" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Legal Entity Name</div>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>PANDI GANESH BABU</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <ShieldCheck size={18} color="#0284c7" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Brand & Trade Name</div>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>ProfitupX (https://profitupx.com)</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Mail size={18} color="#0284c7" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Official Email Address</div>
                    <a href="mailto:ganeshdon5555@gmail.com" style={{ fontWeight: 800, color: '#0284c7', textDecoration: 'none' }}>
                      ganeshdon5555@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Phone size={18} color="#0284c7" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Customer Helpline / Phone</div>
                    <a href="tel:+918098824262" style={{ fontWeight: 800, color: '#0f172a', textDecoration: 'none' }}>
                      +91 8098824262
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <MapPin size={18} color="#0284c7" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Registered Office Address</div>
                    <div style={{ fontWeight: 700, color: '#334155', lineHeight: 1.5 }}>
                      KPT Nagar, Ayyampalayam, Dindigul, Tamil Nadu - 624601, India
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Clock size={18} color="#0284c7" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Support Working Hours</div>
                    <div style={{ fontWeight: 700, color: '#334155' }}>
                      Monday to Saturday (9:00 AM – 6:00 PM IST)
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Interactive Message Form */}
          <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>Send Us a Message</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '24px' }}>We respond to all support requests within 2 hours during working days.</p>

            {submitted ? (
              <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '16px', padding: '32px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={48} color="#059669" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#065f46', margin: 0 }}>Message Received!</h4>
                <p style={{ fontSize: '0.88rem', color: '#047857', maxWidth: '300px', margin: 0 }}>
                  Thank you for reaching out. Our support team (Pandi Ganesh Babu) will contact you shortly at {formData.email}.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', message: '' }); }}
                  style={{ marginTop: '12px', padding: '8px 18px', background: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Your Query / Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your question or order details..."
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ padding: '14px 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px', transition: 'background 0.2s' }}
                >
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
