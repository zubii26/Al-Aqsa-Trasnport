import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';
import React from 'react';

interface AbandonedCartTemplateProps {
    customerName: string;
    pickup: string;
    dropoff: string;
    vehicleName?: string;
    recoveryLink: string;
}

export const AbandonedCartTemplate = ({
    customerName,
    pickup,
    dropoff,
    vehicleName,
    recoveryLink,
}: AbandonedCartTemplateProps) => {
    const previewText = `Don't miss out on your trip to ${dropoff || 'Makkah'}!`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-slate-50 font-sans">
                    <Container className="mx-auto py-8 max-w-lg">
                        {/* Logo */}
                        <Section className="mb-6 text-center">
                            <Img
                                src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
                                width="80"
                                height="80"
                                alt="Al Aqsa Transport"
                                className="mx-auto"
                            />
                        </Section>

                        {/* Card */}
                        <Section className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            {/* Header Image/Banner */}
                            <div className="bg-[#D4AF37] h-2 w-full" />

                            <div className="p-8">
                                <Heading className="text-2xl font-bold text-slate-800 mb-4 text-center">
                                    Your Journey Awaits, {customerName.split(' ')[0]}
                                </Heading>
                                <Text className="text-slate-600 mb-6 text-base leading-relaxed text-center">
                                    We noticed you started booking a trip from <strong>{pickup}</strong> to <strong>{dropoff}</strong>
                                    {vehicleName && ` with our premium ${vehicleName}`} but didn't finish.
                                </Text>

                                <Text className="text-slate-600 mb-8 text-base leading-relaxed text-center">
                                    High demand is expected soon. Secure your luxury transport now to ensure availability.
                                </Text>

                                <Section className="text-center mb-8">
                                    <Button
                                        href={recoveryLink}
                                        className="bg-[#D4AF37] text-white font-bold px-8 py-4 rounded-xl text-base hover:bg-[#B38E2D] block w-full"
                                    >
                                        Complete My Booking
                                    </Button>
                                </Section>

                                <Text className="text-center text-slate-400 text-xs">
                                    If you already completed your booking, please ignore this email.
                                </Text>
                            </div>
                        </Section>

                        {/* Footer */}
                        <Section className="text-center mt-8">
                            <Text className="text-slate-400 text-xs">
                                © {new Date().getFullYear()} Al Aqsa Transport. All rights reserved.
                            </Text>
                            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/contact`} className="text-slate-400 text-xs underline">
                                Contact Support
                            </Link>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default AbandonedCartTemplate;
