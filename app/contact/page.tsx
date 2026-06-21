'use client'

import { useState } from 'react'
import { sendEmailAction } from '@/app/actions/send-email'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Mail, Instagram, Youtube, Twitter, Linkedin, MessageCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const res = await sendEmailAction(formData)

      if (res?.error) {
        setErrorMsg(res.error)
      } else {
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      console.error('[v0] Error submitting form:', error)
      setErrorMsg('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4 text-center">
            <h1 className="text-5xl font-bold text-foreground">Let&apos;s Work Together</h1>
            <p className="text-xl text-foreground/70">Ready to transform your footage into engaging content? Reach out and let&apos;s discuss your project.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitted && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200">
                    Thank you for reaching out! I&apos;ll get back to you soon.
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="What&apos;s this about?"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <Button type="submit" size="lg" disabled={loading} className="w-full">
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>

                {errorMsg && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                    {errorMsg}
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Get In Touch</h3>

                <div className="space-y-8">
                  <a
                    href="mailto:darshangentyal02@gmail.com"
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-card transition-colors"
                  >
                    <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">Email</p>
                      <p className="font-medium text-foreground break-all">darshangentyal02@gmail.com</p>
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/devang_gentyal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-card transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">Instagram</p>
                      <p className="font-medium text-foreground">@devang_gentyal</p>
                    </div>
                  </a>

                  <a
                    href="https://www.youtube.com/@devangcreates"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-card transition-colors"
                  >
                    <Youtube className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">YouTube</p>
                      <p className="font-medium text-foreground">@devangcreates</p>
                    </div>
                  </a>

                  <a
                    href="https://x.com/DevangGentyal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-card transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">Twitter/X</p>
                      <p className="font-medium text-foreground">@DevangGentyal</p>
                    </div>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/devang-gentyal-4b6990267/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-card transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">LinkedIn</p>
                      <p className="font-medium text-foreground">Devang Gentyal</p>
                    </div>
                  </a>

                  <a
                    href="https://discord.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-card transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-foreground/60">Discord</p>
                      <p className="font-medium text-foreground">drax_gamer</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="space-y-4 p-6 bg-primary/5 border border-primary/20 rounded-lg">
                <h3 className="font-bold text-foreground">Available For</h3>
                <ul className="text-sm text-foreground/70 space-y-2">
                  <li>• Freelance Projects</li>
                  <li>• Creator Partnerships</li>
                  <li>• Agency Collaborations</li>
                  <li>• Long-Term Opportunities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-foreground/60 text-sm">
          <p>© 2024 Devang Creates. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
