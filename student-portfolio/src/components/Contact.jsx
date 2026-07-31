import { useState } from 'react';
import { Send, User, Mail, MessageSquare, Eye } from 'lucide-react';

const INITIAL = { name: '', email: '', subject: '', message: '' };

function Contact() {
  const [form, setForm]           = useState(INITIAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Controlled input handler — updates the relevant field in real time
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setForm(INITIAL);
    }, 1200);
  };

  const hasContent = Object.values(form).some((v) => v.trim() !== '');

  if (submitted) {
    return (
      <div className="contact-page animate-fade-in">
        <div className="glass-card contact-card contact-success">
          <div className="success-icon">✉️</div>
          <h2>Message Sent!</h2>
          <p>Thanks for reaching out. I'll get back to you soon.</p>
          <button className="submit-btn" style={{ marginTop: '1.5rem' }} onClick={() => setSubmitted(false)}>
            Send Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page animate-fade-in delay-2">
      <h2 className="section-title">Get in Touch</h2>

      <div className="contact-layout">
        {/* ── Form ── */}
        <div className="glass-card contact-card">
          <form onSubmit={handleSubmit} className="contact-form" noValidate>

            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">
                <User size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="e.g. Dharmit Maru"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                <Mail size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Subject */}
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="form-input"
                placeholder="What's it about?"
                value={form.subject}
                onChange={handleChange}
              />
            </div>

            {/* Message */}
            <div className="form-group">
              <label htmlFor="message">
                <MessageSquare size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="form-textarea"
                placeholder="Hello Dharmit, I'd like to work with you…"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
              />
              <div className="char-count">{form.message.length} characters</div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting || !form.name || !form.email || !form.message}
            >
              {isSubmitting ? (
                <span className="btn-loading">Sending…</span>
              ) : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── Live Preview ── */}
        <div className={`live-preview glass-card ${hasContent ? 'preview-active' : ''}`}>
          <h3 className="preview-heading">
            <Eye size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Live Preview
          </h3>

          <div className="preview-field">
            <span className="preview-label">From</span>
            <span className="preview-value">{form.name || <em className="preview-empty">Your name…</em>}</span>
          </div>

          <div className="preview-field">
            <span className="preview-label">Email</span>
            <span className="preview-value">{form.email || <em className="preview-empty">your@email.com</em>}</span>
          </div>

          <div className="preview-field">
            <span className="preview-label">Subject</span>
            <span className="preview-value">{form.subject || <em className="preview-empty">No subject</em>}</span>
          </div>

          <div className="preview-field preview-message-field">
            <span className="preview-label">Message</span>
            <p className="preview-message">
              {form.message || <em className="preview-empty">Your message will appear here as you type…</em>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
