import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Read Al Aqsa Umrah Transport\'s Privacy Policy. Discover how your personal information is protected when booking your premium Umrah cab and airport transfer.',
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen py-24 bg-slate-50 dark:bg-slate-900">
            <Script id="privacy-schema" type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "WebPage",
                            "@id": "https://www.alaqsaumrahtransport.com/privacy/#webpage",
                            "url": "https://www.alaqsaumrahtransport.com/privacy",
                            "name": "Privacy Policy | Al Aqsa Umrah Transport Booking",
                            "description": "Read Al Aqsa Umrah Transport's Privacy Policy. Discover how your personal information is protected when booking your premium Umrah cab and airport transfer.",
                            "isPartOf": {
                                "@type": "WebSite",
                                "@id": "https://www.alaqsaumrahtransport.com/#website",
                                "url": "https://www.alaqsaumrahtransport.com",
                                "name": "Al Aqsa Umrah Transport",
                                "publisher": {
                                    "@type": "Organization",
                                    "name": "Al Aqsa Umrah Transport",
                                    "url": "https://www.alaqsaumrahtransport.com"
                                }
                            }
                        },
                        {
                            "@type": "FAQPage",
                            "mainEntity": [
                                {
                                    "@type": "Question",
                                    "name": "Is my credit card information safe when I book online?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Yes. We use PCI-compliant payment gateways and SSL encryption to ensure your secure online booking. We never store your full credit card information on our servers."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Will my booking details be shared with anyone else?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Your booking details remain confidential. We only share essential information, such as your pickup location and name, with your assigned driver to coordinate your hotel transfer in Saudi Arabia. Personal information is never sold to third parties."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Do you keep my information after my trip is completed?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "We retain your information only as long as necessary for legal, accounting, and customer support purposes. After this period, it is securely removed from our active systems."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Can I request to have my personal data deleted?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Absolutely. In compliance with GDPR principles, you have the right to request the deletion of your personal data at any time by contacting our support team."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "How do you contact me regarding my booking?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "We primarily use email for booking confirmations and receipts. For real-time updates, driver coordination, and immediate support during your journey, we use WhatsApp to ensure a smooth luxury chauffeur service experience."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Is my data protected if I am booking from outside Saudi Arabia?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Yes. Whether you are booking from the UK, USA, Europe, or the GCC, we adhere to strict international data protection standards, including UK GDPR, to ensure international travellers are protected."
                                    }
                                }
                            ]
                        }
                    ]
                })
            }} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Privacy Policy</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                            Your privacy is as important as your journey. At Al Aqsa Umrah Transport, we understand that preparing for your Umrah or Hajj is a deeply personal and spiritual experience. We are committed to ensuring that every booking is handled with strict confidentiality, allowing you to focus on what truly matters.
                        </p>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto mt-4">
                            Our goal is to provide a secure booking experience from reservation to arrival, ensuring the personal information you entrust to us is safeguarded and respected. This policy explains exactly how we collect, use, and protect your information when you book our premium Umrah & Hajj transportation services.
                        </p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-secondary hover:prose-a:text-[#B38E2D]">
                        
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl mb-12 border border-slate-100 dark:border-slate-700">
                            <h2 className="text-xl mt-0 mb-4">Table of Contents</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 m-0 p-0 list-none">
                                <li><a href="#who-we-are" className="no-underline hover:underline">1. Who We Are</a></li>
                                <li><a href="#information-we-collect" className="no-underline hover:underline">2. Information We Collect During Booking</a></li>
                                <li><a href="#information-automatically-collected" className="no-underline hover:underline">3. Information Automatically Collected</a></li>
                                <li><a href="#how-we-use-your-information" className="no-underline hover:underline">4. How We Use Your Information</a></li>
                                <li><a href="#payment-security" className="no-underline hover:underline">5. Payment Security</a></li>
                                <li><a href="#cookies" className="no-underline hover:underline">6. Cookies</a></li>
                                <li><a href="#sharing-information" className="no-underline hover:underline">7. Sharing Information</a></li>
                                <li><a href="#international-data-transfers" className="no-underline hover:underline">8. International Data Transfers</a></li>
                                <li><a href="#data-retention" className="no-underline hover:underline">9. Data Retention</a></li>
                                <li><a href="#your-rights" className="no-underline hover:underline">10. Your Rights</a></li>
                                <li><a href="#childrens-privacy" className="no-underline hover:underline">11. Children's Privacy</a></li>
                                <li><a href="#security-measures" className="no-underline hover:underline">12. Security Measures</a></li>
                                <li><a href="#third-party-services" className="no-underline hover:underline">13. Third Party Services</a></li>
                                <li><a href="#policy-updates" className="no-underline hover:underline">14. Policy Updates</a></li>
                                <li><a href="#contact-information" className="no-underline hover:underline">15. Contact Information</a></li>
                            </ul>
                        </div>

                        <h3 id="who-we-are" className="text-2xl pt-8 border-t border-slate-200 dark:border-slate-700">1. Who We Are</h3>
                        <p>We are <strong>Al Aqsa Umrah Transport</strong>, a trusted provider of premium Umrah cab and transportation services across Saudi Arabia. Specialising in safe and comfortable journeys for international pilgrims, families, and luxury travellers, we offer comprehensive transport solutions including Jeddah airport transfers, Makkah to Madinah transport, Ziyarah tours, and executive transport.</p>

                        <h3 id="information-we-collect">2. Information We Collect During Booking</h3>
                        <p>We only collect the information necessary to provide a safe and reliable Umrah transport service. When you secure your online booking, we may collect the following:</p>
                        <ul>
                            <li>Full Name, Phone Number, WhatsApp Number, Email Address</li>
                            <li>Pickup Location, Drop-off Location</li>
                            <li>Flight Number, Arrival Time, Hotel Name</li>
                            <li>Passenger Count, Luggage Count, Vehicle Preference</li>
                            <li>Special Requests, Payment Information</li>
                            <li>Booking History, Communication Records</li>
                        </ul>

                        <h3 id="information-automatically-collected">3. Information Automatically Collected</h3>
                        <p>When you visit our website to make an airport transfer booking, we automatically collect certain technical information to ensure a seamless experience:</p>
                        <ul>
                            <li>IP Address, Browser Type and Version, Operating System</li>
                            <li>Cookies, Device Type, Pages Visited</li>
                            <li>Referral Source, Booking Behaviour, Analytics Data</li>
                        </ul>

                        <h3 id="how-we-use-your-information">4. How We Use Your Information</h3>
                        <p>Your data is handled responsibly and used primarily to ensure your luxury Umrah transport runs flawlessly. We use your details for:</p>
                        <ul>
                            <li><strong>Booking confirmation:</strong> Sending your itinerary and receipts.</li>
                            <li><strong>Customer support:</strong> Assisting you before, during, and after your trip.</li>
                            <li><strong>Driver assignment:</strong> Ensuring your private chauffeur in Saudi Arabia knows where and when to meet you.</li>
                            <li><strong>Trip management:</strong> Coordinating Makkah taxi and Madinah taxi routes effectively.</li>
                            <li><strong>WhatsApp communication:</strong> Providing real-time updates and direct support.</li>
                            <li><strong>Airport pickup coordination:</strong> Monitoring your flight for punctual Saudi Arabia airport transfers.</li>
                            <li><strong>Fraud prevention:</strong> Protecting both you and our business.</li>
                            <li><strong>Website improvements:</strong> Enhancing the booking experience for future visitors.</li>
                            <li><strong>Customer experience:</strong> Tailoring our luxury chauffeur service to your needs.</li>
                            <li><strong>Marketing:</strong> Sending promotional offers (only with your explicit consent).</li>
                        </ul>

                        <h3 id="payment-security">5. Payment Security</h3>
                        <p>We guarantee secure online booking for all our premium Umrah cab services.</p>
                        <ul>
                            <li><strong>Payment gateways:</strong> We use trusted, globally recognised payment processors.</li>
                            <li><strong>Encrypted payments:</strong> All financial transactions are secured using industry-standard encryption.</li>
                            <li><strong>No storage of complete card information:</strong> We never store your full credit card details on our servers.</li>
                            <li><strong>Secure checkout:</strong> Our checkout process is designed to protect you from fraud.</li>
                            <li><strong>PCI-compliant processors:</strong> We ensure our partners meet strict Payment Card Industry (PCI) data security standards where applicable.</li>
                        </ul>

                        <h3 id="cookies">6. Cookies</h3>
                        <p>We use cookies to enhance your experience while you arrange your private Umrah taxi.</p>
                        <ul>
                            <li><strong>Essential cookies:</strong> Necessary for the website and secure booking system to function.</li>
                            <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site so we can improve.</li>
                            <li><strong>Performance cookies:</strong> Ensure fast loading times and smooth navigation.</li>
                            <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements (only if accepted).</li>
                        </ul>
                        <p><em>You can disable or manage cookies at any time through your browser settings.</em></p>

                        <h3 id="sharing-information">7. Sharing Information</h3>
                        <p>Personal information is never sold to third parties. We may only share your booking information with:</p>
                        <ul>
                            <li><strong>Assigned drivers:</strong> So they know who to pick up and where to go.</li>
                            <li><strong>Payment processors:</strong> To securely handle your transaction.</li>
                            <li><strong>Government authorities:</strong> Only where legally required for safety or compliance.</li>
                            <li><strong>Technology providers:</strong> Essential services that help our booking platform operate.</li>
                        </ul>

                        <h3 id="international-data-transfers">8. International Data Transfers</h3>
                        <p>As we serve international pilgrims from the UK, USA, Canada, Australia, Europe, and the GCC, your data may be transferred to and processed in Saudi Arabia or other secure locations. We adhere to GDPR principles and UK GDPR guidelines, ensuring your information receives the same level of protection as it would in your home country. International travellers are protected with strict data safeguards.</p>

                        <h3 id="data-retention">9. Data Retention</h3>
                        <p>We retain your booking information only for as long as necessary to fulfil our services, comply with legal obligations, resolve disputes, and enforce our agreements. After this period, your data is securely deleted or anonymized.</p>

                        <h3 id="your-rights">10. Your Rights</h3>
                        <p>Customer privacy is respected at all times. Depending on your location, you have the right to:</p>
                        <ul>
                            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                            <li><strong>Correction:</strong> Ask us to update or fix inaccurate information.</li>
                            <li><strong>Deletion:</strong> Request the erasure of your data.</li>
                            <li><strong>Restriction:</strong> Ask us to limit how we process your information.</li>
                            <li><strong>Withdrawal of consent:</strong> Opt-out of marketing communications at any time.</li>
                            <li><strong>Data portability:</strong> Request your data in a structured, commonly used format.</li>
                            <li><strong>Complaint rights:</strong> Lodge a complaint with a regulatory authority if you feel your rights have been violated.</li>
                        </ul>

                        <h3 id="childrens-privacy">11. Children's Privacy</h3>
                        <p>Our family Umrah transport services are booked by adults. We do not knowingly collect personal information from children under 18 without parental consent. If we become aware that we have collected such data, we will take immediate steps to delete it.</p>

                        <h3 id="security-measures">12. Security Measures</h3>
                        <p>Booking information is encrypted and protected by robust security protocols:</p>
                        <ul>
                            <li><strong>SSL encryption:</strong> Securing data transmitted between your browser and our servers.</li>
                            <li><strong>Secure servers:</strong> Hosted in highly secure data centres.</li>
                            <li><strong>Access control:</strong> Only authorised personnel can access booking data.</li>
                            <li><strong>Limited staff access:</strong> Employees only see the information required to perform their duties.</li>
                        </ul>

                        <h3 id="third-party-services">13. Third Party Services</h3>
                        <p>To provide our Makkah to Madinah transport and airport pickup in Saudi Arabia, we utilize trusted third-party tools:</p>
                        <ul>
                            <li><strong>Google Analytics:</strong> To understand website traffic.</li>
                            <li><strong>Google Maps:</strong> For route calculation and distance estimation.</li>
                            <li><strong>Google reCAPTCHA:</strong> To prevent spam and abuse.</li>
                            <li><strong>Payment providers:</strong> To process your secure transaction.</li>
                            <li><strong>WhatsApp:</strong> For seamless communication.</li>
                            <li><strong>Email services:</strong> To deliver your booking confirmations securely.</li>
                        </ul>

                        <h3 id="policy-updates">14. Policy Updates</h3>
                        <p>We may update this Privacy Policy periodically to reflect changes in our practices, technology, or legal requirements. We encourage you to review this page before making an Umrah cab booking to stay informed about how we protect your privacy.</p>

                        <h3 id="contact-information">15. Contact Information</h3>
                        <p>If you have any questions about this Privacy Policy or how your data is handled, please reach out to us:</p>
                        <ul>
                            <li><strong>Website:</strong> <Link href="/">www.alaqsaumrahtransport.com</Link></li>
                            <li><strong>Contact Page:</strong> <Link href="/contact">Contact Us</Link></li>
                        </ul>

                        <hr className="my-12 border-slate-200 dark:border-slate-700" />

                        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                        
                        <div className="space-y-6">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0 mb-2">Is my credit card information safe when I book online?</h4>
                                <p className="mb-0 text-slate-600 dark:text-slate-300">Yes. We use PCI-compliant payment gateways and SSL encryption to ensure your secure online booking. We never store your full credit card information on our servers.</p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0 mb-2">Will my booking details be shared with anyone else?</h4>
                                <p className="mb-0 text-slate-600 dark:text-slate-300">Your booking details remain confidential. We only share essential information, such as your pickup location and name, with your assigned driver to coordinate your hotel transfer in Saudi Arabia. Personal information is never sold to third parties.</p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0 mb-2">Do you keep my information after my trip is completed?</h4>
                                <p className="mb-0 text-slate-600 dark:text-slate-300">We retain your information only as long as necessary for legal, accounting, and customer support purposes. After this period, it is securely removed from our active systems.</p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0 mb-2">Can I request to have my personal data deleted?</h4>
                                <p className="mb-0 text-slate-600 dark:text-slate-300">Absolutely. In compliance with GDPR principles, you have the right to request the deletion of your personal data at any time by contacting our support team.</p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0 mb-2">How do you contact me regarding my booking?</h4>
                                <p className="mb-0 text-slate-600 dark:text-slate-300">We primarily use email for booking confirmations and receipts. For real-time updates, driver coordination, and immediate support during your journey, we use WhatsApp to ensure a smooth luxury chauffeur service experience.</p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0 mb-2">Is my data protected if I am booking from outside Saudi Arabia?</h4>
                                <p className="mb-0 text-slate-600 dark:text-slate-300">Yes. Whether you are booking from the UK, USA, Europe, or the GCC, we adhere to strict international data protection standards, including UK GDPR, to ensure international travellers are protected.</p>
                            </div>
                        </div>
                        
                        <div className="mt-12 p-6 bg-secondary/10 rounded-2xl border border-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white m-0">Ready to travel securely?</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 m-0 mt-1">Book your premium Umrah transport today with complete peace of mind.</p>
                            </div>
                            <Link href="/booking" className="whitespace-nowrap px-6 py-3 bg-secondary hover:bg-[#B38E2D] text-white font-bold rounded-xl transition-colors">
                                Book Now
                            </Link>
                        </div>
                        
                    </div>
                </div>
            </div>
        </main>
    );
}
