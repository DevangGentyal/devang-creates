import React, { useState } from 'react';
import { Send, Mail, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log(formData);
    alert('Form submitted! This would normally connect to your backend.');
    setFormData({
      name: '',
      email: '',
      service: '',
      message: '',
    });
  };

  return (
    <section id="contact" className="py-20 bg-background-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-white">
              Ready to <span className="text-primary">Collaborate</span>?
            </h2>
            
            <p className="text-neutral-300 mb-8">
              Let's create amazing videos together. Whether you have a specific project in mind
              or need consultation on the best approach, I'm here to help turn your vision into reality.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Email</h3>
                  <p className="text-neutral-400 text-sm">contact@videoeditor.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Phone</h3>
                  <p className="text-neutral-400 text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Response Time</h3>
                  <p className="text-neutral-400 text-sm">Within 24 hours</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="bg-background p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your email"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="service" className="block text-sm font-medium text-neutral-300 mb-2">
                  Service Needed
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  <option value="" disabled>Select a service</option>
                  <option value="short-form">Short Form Editing</option>
                  <option value="long-form">Long Form Editing</option>
                  <option value="color-grading">Color Grading</option>
                  <option value="motion-graphics">Motion Graphics</option>
                  <option value="consultation">Consultation</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
                  Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Tell me about your project"
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;