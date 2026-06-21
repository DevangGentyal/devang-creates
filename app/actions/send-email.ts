'use server'

import nodemailer from 'nodemailer'

export async function sendEmailAction(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const { name, email, subject, message } = formData

  if (!name || !email || !subject || !message) {
    return { error: 'Please fill out all fields.' }
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    const mailOptions = {
      from: `"${process.env.GMAIL_FROM_NAME}" <${process.env.GMAIL_FROM_EMAIL}>`,
      to: 'darshangentyal02@gmail.com', // Sending the email to your primary address
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    }

    await transporter.sendMail(mailOptions)

    return { success: true }
  } catch (error: any) {
    console.error('Exception sending email:', error)
    return { error: error.message || 'An unexpected error occurred while sending the email.' }
  }
}
