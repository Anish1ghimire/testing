import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: new Date(),
        status: 'unread',
      });

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white pt-16">
      {/* Header */}
      <section className="py-16 bg-dark-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-orbitron font-black mb-4 glow-text">
              Contact Us
            </h1>
            <p className="text-xl text-light-gray max-w-2xl mx-auto">
              Get in touch with our team for any questions or support
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-orbitron font-bold mb-6 glow-text">
                  Get In Touch
                </h2>
                <p className="text-light-gray text-lg mb-8">
                  Have questions about tournaments, registration, or technical issues? 
                  We're here to help! Reach out to us through any of these channels.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                <div className="neon-border rounded-lg p-6 glass-effect hover:shadow-lg hover:shadow-neon-blue/20 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-neon-gradient rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-dark-bg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-orbitron font-bold text-neon-blue">
                        Email Support
                      </h3>
                      <p className="text-light-gray">support@reprixesports.com</p>
                      <p className="text-sm text-light-gray/70">24/7 Support Available</p>
                    </div>
                  </div>
                </div>

                <div className="neon-border rounded-lg p-6 glass-effect hover:shadow-lg hover:shadow-neon-blue/20 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-neon-gradient rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-dark-bg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-orbitron font-bold text-neon-blue">
                        Phone Support
                      </h3>
                      <p className="text-light-gray">+91 98765 43210</p>
                      <p className="text-sm text-light-gray/70">Mon-Fri: 9AM-6PM IST</p>
                    </div>
                  </div>
                </div>

                <div className="neon-border rounded-lg p-6 glass-effect hover:shadow-lg hover:shadow-neon-blue/20 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-neon-gradient rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-dark-bg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-orbitron font-bold text-neon-blue">
                        Office Location
                      </h3>
                      <p className="text-light-gray">Mumbai, Maharashtra</p>
                      <p className="text-sm text-light-gray/70">India</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-xl font-orbitron font-bold mb-4 text-neon-purple">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  {['Discord', 'Twitter', 'Instagram', 'YouTube'].map((platform) => (
                    <button
                      key={platform}
                      className="btn-neon-purple px-4 py-2 text-sm"
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="neon-border rounded-lg p-8 glass-effect">
              <h2 className="text-2xl font-orbitron font-bold mb-6 text-center">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full input-neon"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full input-neon"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full input-neon"
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full input-neon resize-none"
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-neon flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>

              <div className="mt-6 p-4 bg-neon-blue/10 border border-neon-blue/30 rounded-lg">
                <p className="text-sm text-light-gray text-center">
                  <span className="text-neon-blue font-medium">Quick Response:</span> 
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;