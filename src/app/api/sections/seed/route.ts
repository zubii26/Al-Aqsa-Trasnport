import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Section } from '@/models';
import { validateRequest } from '@/lib/server-auth';

type SeedSection = {
    name: string;
    page: string;
    type: string;
    title: string;
    subtitle: string;
    content: string;
    customFields?: {
        key: string;
        label: string;
        value: string;
        type: 'text' | 'link' | 'color' | 'boolean';
    }[];
};

const INITIAL_SECTIONS: SeedSection[] = [
    // --- HOME PAGE ---
    {
        name: 'home-hero',
        page: 'Home',
        type: 'hero',
        title: 'Experience Spiritual Comfort',
        subtitle: 'Premium transport services for Umrah and Hajj pilgrims in Saudi Arabia.',
        content: '<p>Welcome to Al Aqsa Transport.</p>',
        customFields: [
            { key: 'cta_text', label: 'CTA Button Text', value: 'Book Now', type: 'text' },
            { key: 'cta_link', label: 'CTA Link', value: '/booking', type: 'link' }
        ]
    },
    {
        name: 'home-about',
        page: 'Home',
        type: 'content',
        title: 'Why Choose Us',
        subtitle: 'Reliability, Comfort, and Safety',
        content: '<p>We provide the best service...</p>'
    },

    // --- FLEET PAGE ---
    {
        name: 'fleet-hero',
        page: 'Fleet',
        type: 'hero',
        title: 'Our Premium Fleet',
        subtitle: 'Experience luxury and comfort with our diverse range of vehicles.',
        content: '',
        customFields: [
            { key: 'badge_text', label: 'Badge Text', value: 'Premium Collection 2025', type: 'text' }
        ]
    },

    // --- ABOUT PAGE ---
    {
        name: 'about-hero',
        page: 'About',
        type: 'hero',
        title: 'About Al Aqsa',
        subtitle: 'Serving pilgrims with honor and dedication since 2010.',
        content: ''
    },
    {
        name: 'about-mission',
        page: 'About',
        type: 'content',
        title: 'Our Mission',
        subtitle: '',
        content: '<p>To provide safe and comfortable transport...</p>'
    }
];

export async function POST() {
    try {
        const user = await validateRequest();
        if (!user || !['admin'].includes(user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        let createdCount = 0;

        for (const sectionData of INITIAL_SECTIONS) {
            const existing = await Section.findOne({ name: sectionData.name });
            if (!existing) {
                await Section.create({
                    ...sectionData,
                    lastUpdatedBy: user.id,
                    images: [] // Initialize empty images
                });
                createdCount++;
            }
        }

        return NextResponse.json({
            message: 'Seeding complete',
            created: createdCount
        });
    } catch (error) {
        console.error('Error seeding sections:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
