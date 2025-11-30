'use client';

import { useState } from 'react';
import styles from '@/app/contact/page.module.css';

export default function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [emailError, setEmailError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setEmailError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        // Strict Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address (e.g., user@example.com)');
            return;
        }

        setStatus('submitting');
        const data = {
            name: formData.get('name'),
            email: email,
            message: formData.get('message'),
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" className={styles.input} placeholder="Your Name" required />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className={`${styles.input} ${emailError ? 'border-red-500' : ''}`}
                    placeholder="your@email.com"
                    required
                    onChange={() => setEmailError('')}
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="message">Message</label>
                <textarea id="message" name="message" className={styles.textarea} placeholder="How can we help you?" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'success' && <p className="text-green-600 mt-2">Message sent successfully!</p>}
            {status === 'error' && <p className="text-red-600 mt-2">Failed to send message. Please try again.</p>}
        </form>
    );
}
