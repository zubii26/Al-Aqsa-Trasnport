import styles from './terms.module.css';
import { Mail, Phone, MapPin } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';

export default function TermsPage() {
    return (
        <div className={styles.container}>
            <FadeIn>
                <div className={styles.header}>
                    <h1 className={styles.title}>Terms and Conditions</h1>
                    <p className={styles.subtitle}>Last Updated: November 2025</p>
                </div>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>1. Introduction</h2>
                        <p className={styles.text}>
                            Welcome to Al Aqsa Umrah Transport. By accessing our website and using our services, you agree to be bound by these Terms and Conditions. Please read them carefully before making a booking.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>2. Bookings and Payments</h2>
                        <p className={styles.text}>
                            All bookings are subject to availability and confirmation. We reserve the right to decline any booking at our discretion.
                        </p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}><strong>Pricing:</strong> Prices are subject to change without notice, but confirmed bookings will be honored at the agreed rate.</li>
                            <li className={styles.listItem}><strong>Payment:</strong> Full payment or a deposit may be required to secure your reservation, as specified during the booking process.</li>
                            <li className={styles.listItem}><strong>Confirmation:</strong> You will receive a booking confirmation via email or WhatsApp once your reservation is processed.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>3. Cancellations and Refunds</h2>
                        <p className={styles.text}>
                            We understand that plans can change. Our cancellation policy is designed to be fair to both parties.
                        </p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Cancellations made more than 48 hours before the scheduled pickup time may be eligible for a full refund.</li>
                            <li className={styles.listItem}>Cancellations made within 24-48 hours may incur a cancellation fee.</li>
                            <li className={styles.listItem}>No-shows or cancellations made less than 24 hours in advance are non-refundable.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>4. User Responsibilities</h2>
                        <p className={styles.text}>
                            As a user of our services, you agree to:
                        </p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Provide accurate and complete information during booking.</li>
                            <li className={styles.listItem}>Be ready at the designated pickup location at the scheduled time.</li>
                            <li className={styles.listItem}>Treat our drivers and vehicles with respect.</li>
                            <li className={styles.listItem}>Comply with all local laws and regulations during your journey.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>5. Limitation of Liability</h2>
                        <p className={styles.text}>
                            Al Aqsa Umrah Transport shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of our services.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>6. Contact Us</h2>
                        <p className={styles.text}>
                            If you have any questions about these Terms and Conditions, please contact us:
                        </p>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <MapPin size={20} className="text-amber-500" />
                                <span>Jeddah, Saudi Arabia</span>
                            </div>
                            <div className={styles.contactItem}>
                                <Phone size={20} className="text-amber-500" />
                                <span>+92 326 060 0676</span>
                            </div>
                            <div className={styles.contactItem}>
                                <Mail size={20} className="text-amber-500" />
                                <span>meharzubair703@gmail.com</span>
                            </div>
                        </div>
                    </section>
                </div>
            </FadeIn>
        </div>
    );
}
