'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Trash2, ExternalLink, Bot } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './AIChatBox.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    action?: {
        label: string;
        url: string;
    };
}

import { useMenu } from '@/context/MenuContext';

export default function AIChatBox() {
    const { t, language } = useLanguage();
    const { isMenuOpen } = useMenu();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ... existing code ...

    // Quick Replies Data
    const quickReplies = {
        en: ['Check Prices', 'Book a Ride', 'Contact Support', 'Vehicle Types'],
        ar: ['تحقق من الأسعار', 'احجز رحلة', 'اتصل بالدعم', 'أنواع المركبات'],
        ur: ['قیمتیں چیک کریں', 'سواری بک کریں', 'سپورٹ سے رابطہ کریں', 'گاڑیوں کی اقسام']
    };

    const initializeGreeting = () => {
        let greetingText = '';

        const greetings = {
            en: {
                default: 'Hello! 👋 I am your Al Aqsa AI assistant. How can I help you with your Umrah transport today?',
                booking: 'Welcome to our booking page! 📅 Do you need any help filling out the form or choosing a vehicle?',
                fleet: 'Browsing our fleet? 🚗 Let me know if you want to know more about our Sedans, SUVs, or Buses.',
                services: 'We offer VIP services and Ziyarat tours. 🕌 How can I assist you with our services?'
            },
            ar: {
                default: 'مرحباً! 👋 أنا مساعد الأقصى الذكي. كيف يمكنني مساعدتك في تنقلات العمرة اليوم؟',
                booking: 'مرحباً بك في صفحة الحجز! 📅 هل تحتاج إلى مساعدة في ملء النموذج أو اختيار مركبة؟',
                fleet: 'تتصفح أسطولنا؟ 🚗 أخبرني إذا كنت تريد معرفة المزيد عن سيارات السيدان أو الدفع الرباعي أو الحافلات.',
                services: 'نقدم خدمات VIP وجولات زيارة. 🕌 كيف يمكنني مساعدتك في خدماتنا؟'
            },
            ur: {
                default: 'السلام علیکم! 👋 میں آپ کا الاقصی AI اسسٹنٹ ہوں۔ آج میں عمرہ ٹرانسپورٹ کے حوالے سے آپ کی کیا مدد کر سکتا ہوں؟',
                booking: 'ہمارے بکنگ پیج پر خوش آمدید! 📅 کیا آپ کو فارم پُر کرنے یا گاڑی کا انتخاب کرنے میں کوئی مدد درکار ہے؟',
                fleet: 'ہمارا بیڑا دیکھ رہے ہیں؟ 🚗 اگر آپ ہماری سیڈان، ایس یو وی، یا بسوں کے بارے میں مزید جاننا چاہتے ہیں تو مجھے بتائیں۔',
                services: 'ہم VIP خدمات اور زیارت کے دورے پیش کرتے ہیں۔ 🕌 میں ہماری خدمات کے حوالے سے آپ کی کیا مدد کر سکتا ہوں؟'
            }
        };

        const currentLangGreetings = greetings[language as keyof typeof greetings] || greetings.en;

        if (pathname === '/booking') greetingText = currentLangGreetings.booking;
        else if (pathname === '/fleet') greetingText = currentLangGreetings.fleet;
        else if (pathname === '/services') greetingText = currentLangGreetings.services;
        else greetingText = currentLangGreetings.default;

        setMessages([
            {
                id: '1',
                text: greetingText,
                sender: 'ai',
                timestamp: new Date(),
            },
        ]);
    };

    // Load messages from localStorage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem('chatHistory');
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                // Convert string timestamps back to Date objects
                const hydrated = parsed.map((msg: Message & { timestamp: string }) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setMessages(hydrated);
            } catch (e) {
                console.error('Failed to parse chat history', e);
            }
        } else {
            // Initial greeting if no history
            // eslint-disable-next-line react-hooks/set-state-in-effect
            initializeGreeting();
        }
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        }
    }, [messages]);

    // Re-initialize greeting if language changes and chat is empty
    useEffect(() => {
        if (messages.length === 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            initializeGreeting();
        }
    }, [language, pathname]); // Re-run if language or path changes (only if empty)

    const clearChat = () => {
        localStorage.removeItem('chatHistory');
        initializeGreeting();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const generateResponse = (input: string, lang: string): { text: string, action?: { label: string, url: string } } => {
        const lowerInput = input.toLowerCase();

        const responses = {
            en: {
                price: {
                    text: "Our prices are very competitive! Use the Instant Price Calculator on our homepage to get an exact quote for your journey.",
                    action: { label: "Open Calculator", url: "/" }
                },
                book: {
                    text: "Booking is easy! You can use the 'Book Now' button at the top, or simply fill out the Quick Booking form on the homepage.",
                    action: { label: "Book Now", url: "/booking" }
                },
                contact: {
                    text: "You can reach us 24/7 via WhatsApp at +92 326 060 0676 or email us at meharzubair703@gmail.com.",
                    action: { label: "WhatsApp Us", url: "https://wa.me/923260600676" }
                },
                vehicle: {
                    text: "We offer a wide range of vehicles including comfortable Sedans (Camry, Sonata), spacious SUVs (GMC, H1), and luxury Buses for groups.",
                    action: { label: "View Fleet", url: "/fleet" }
                },
                default: {
                    text: "I'm here to help! You can ask me about prices, booking, our vehicles, or contact information."
                }
            },
            ar: {
                price: {
                    text: "أسعارنا تنافسية للغاية! استخدم حاسبة الأسعار الفورية على صفحتنا الرئيسية للحصول على عرض سعر دقيق لرحلتك.",
                    action: { label: "افتح الحاسبة", url: "/" }
                },
                book: {
                    text: "الحجز سهل! يمكنك استخدام زر 'احجز الآن' في الأعلى، أو ببساطة ملء نموذج الحجز السريع على الصفحة الرئيسية.",
                    action: { label: "احجز الآن", url: "/booking" }
                },
                contact: {
                    text: "يمكنك التواصل معنا على مدار الساعة طوال أيام الأسبوع عبر واتساب على الرقم +92 326 060 0676 أو مراسلتنا عبر البريد الإلكتروني meharzubair703@gmail.com.",
                    action: { label: "تواصل عبر واتساب", url: "https://wa.me/923260600676" }
                },
                vehicle: {
                    text: "نقدم مجموعة واسعة من المركبات بما في ذلك سيارات السيدان المريحة (كامري، سوناتا)، وسيارات الدفع الرباعي الواسعة (جي إم سي، إتش 1)، والحافلات الفاخرة للمجموعات.",
                    action: { label: "عرض الأسطول", url: "/fleet" }
                },
                default: {
                    text: "أنا هنا للمساعدة! يمكنك سؤالي عن الأسعار، الحجز، مركباتنا، أو معلومات الاتصال."
                }
            },
            ur: {
                price: {
                    text: "ہماری قیمتیں بہت مسابقتی ہیں! اپنے سفر کے لیے درست تخمینہ حاصل کرنے کے لیے ہمارے ہوم پیج پر فوری قیمت کیلکولیٹر استعمال کریں۔",
                    action: { label: "کیلکولیٹر کھولیں", url: "/" }
                },
                book: {
                    text: "بکنگ آسان ہے! آپ اوپر موجود 'ابھی بک کریں' کا بٹن استعمال کر سکتے ہیں، یا بس ہوم پیج پر فوری بکنگ فارم پُر کریں۔",
                    action: { label: "ابھی بک کریں", url: "/booking" }
                },
                contact: {
                    text: "آپ ہم سے 24/7 واٹس ایپ +92 326 060 0676 پر رابطہ کر سکتے ہیں یا ہمیں meharzubair703@gmail.com پر ای میل کر سکتے ہیں۔",
                    action: { label: "واٹس ایپ کریں", url: "https://wa.me/923260600676" }
                },
                vehicle: {
                    text: "ہم گاڑیوں کی ایک وسیع رینج پیش کرتے ہیں جس میں آرام دہ سیڈان (کیمری، سوناٹا)، کشادہ ایس یو وی (جی ایم سی، ایچ 1)، اور گروپس کے لیے لگژری بسیں شامل ہیں۔",
                    action: { label: "گاڑیاں دیکھیں", url: "/fleet" }
                },
                default: {
                    text: "میں مدد کے لیے حاضر ہوں! آپ مجھ سے قیمتوں، بکنگ، ہماری گاڑیوں، یا رابطہ کی معلومات کے بارے میں پوچھ سکتے ہیں۔"
                }
            }
        };

        const langResponses = responses[lang as keyof typeof responses] || responses.en;

        if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('rate') || lowerInput.includes('سعر') || lowerInput.includes('قیمت')) return langResponses.price;
        if (lowerInput.includes('book') || lowerInput.includes('reserve') || lowerInput.includes('حجز') || lowerInput.includes('بکنگ')) return langResponses.book;
        if (lowerInput.includes('contact') || lowerInput.includes('phone') || lowerInput.includes('email') || lowerInput.includes('اتصل') || lowerInput.includes('رابطہ')) return langResponses.contact;
        if (lowerInput.includes('vehicle') || lowerInput.includes('car') || lowerInput.includes('bus') || lowerInput.includes('مركبة') || lowerInput.includes('گاڑی')) return langResponses.vehicle;

        return langResponses.default;
    };

    const handleSend = async (text: string = inputValue) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: new Date().getTime().toString(),
            text: text,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const response = generateResponse(text, language);

            const aiMessage: Message = {
                id: (new Date().getTime() + 1).toString(),
                text: response.text,
                sender: 'ai',
                timestamp: new Date(),
                action: response.action
            };

            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (isMenuOpen) return null;

    return (
        <div className={styles.container}>
            <div className={`${styles.chatWindow} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-yellow-300" />
                            <h3>Al Aqsa AI</h3>
                        </div>
                        <p>Online • Replies instantly</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={clearChat}
                            className={styles.clearButton}
                            aria-label="Clear chat"
                            title="Clear History"
                        >
                            <Trash2 size={16} />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className={styles.closeButton}
                            aria-label="Close chat"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles.messages}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.userWrapper : styles.aiWrapper}`}
                        >
                            <div
                                className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.aiMessage
                                    }`}
                            >
                                {msg.text}
                                {msg.action && (
                                    <Link href={msg.action.url} className={styles.messageAction} target={msg.action.url.startsWith('http') ? '_blank' : undefined}>
                                        {msg.action.label}
                                        <ExternalLink size={12} />
                                    </Link>
                                )}
                            </div>
                            <span className={styles.timestamp}>
                                {formatTime(msg.timestamp)}
                            </span>
                        </div>
                    ))}
                    {isTyping && (
                        <div className={`${styles.message} ${styles.aiMessage}`}>
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                <div className={styles.quickReplies}>
                    {(quickReplies[language as keyof typeof quickReplies] || quickReplies.en).map((reply, index) => (
                        <button
                            key={index}
                            className={styles.quickReplyChip}
                            onClick={() => handleSend(reply)}
                        >
                            {reply}
                        </button>
                    ))}
                </div>

                <div className={styles.inputArea}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={language === 'ar' ? 'اكتب رسالة...' : language === 'ur' ? 'ایک پیغام لکھیں...' : 'Type a message...'}
                        className={styles.input}
                        dir={language === 'ar' || language === 'ur' ? 'rtl' : 'ltr'}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!inputValue.trim() || isTyping}
                        className={styles.sendButton}
                        aria-label="Send message"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.toggleButton}
                aria-label="Toggle chat"
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}
            </button>
        </div >
    );
}
