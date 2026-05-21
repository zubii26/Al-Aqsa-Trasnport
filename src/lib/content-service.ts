import { Section, ISection } from '@/models';
import dbConnect from '@/lib/mongodb';
import { unstable_cache } from 'next/cache';

const STATIC_FALLBACK_SECTIONS: Record<string, any> = {
    'home-hero': {
        _id: 'fallback-home-hero',
        name: 'home-hero',
        page: 'Home',
        type: 'hero',
        title: 'Experience Spiritual Comfort',
        subtitle: 'Premium transport services for Umrah and Hajj pilgrims in Saudi Arabia.',
        content: '<p>Welcome to Al Aqsa Transport.</p>',
        images: [
            {
                url: '/images/umrah-pilgrims-makkah-taxi-hero.webp',
                alt: 'Home Hero Image',
                type: 'desktop'
            }
        ],
        customFields: [
            { key: 'cta_text', label: 'CTA Button Text', value: 'Book Now / احجز الآن', type: 'text' },
            { key: 'cta_link', label: 'CTA Link', value: '/booking', type: 'link' }
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    'fleet-hero': {
        _id: 'fallback-fleet-hero',
        name: 'fleet-hero',
        page: 'Fleet',
        type: 'hero',
        title: 'Our Premium Fleet',
        subtitle: 'Experience luxury and comfort with our diverse range of vehicles.',
        content: '',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000&auto=format&fit=crop',
                alt: 'Fleet Hero Image',
                type: 'desktop'
            }
        ],
        customFields: [
            { key: 'badge_text', label: 'Badge Text', value: 'Premium Collection 2025', type: 'text' }
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    'about-hero': {
        _id: 'fallback-about-hero',
        name: 'about-hero',
        page: 'About',
        type: 'hero',
        title: 'About Al Aqsa',
        subtitle: 'Serving pilgrims with honor and dedication since 2010.',
        content: '',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=2000&auto=format&fit=crop',
                alt: 'About Hero Image',
                type: 'desktop'
            }
        ],
        customFields: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
};

export const getSectionContent = unstable_cache(
    async (name: string): Promise<ISection | null> => {
        try {
            await dbConnect();
            const section = await Section.findOne({ name, isActive: true }).lean();
            if (!section) return null;

            return {
                ...section,
                _id: section._id.toString(),
                createdAt: section.createdAt,
                updatedAt: section.updatedAt
            } as unknown as ISection;
        } catch (error) {
            console.error(`getSectionContent failed for ${name}, returning static fallback data:`, error);
            const fallback = STATIC_FALLBACK_SECTIONS[name];
            return fallback ? (fallback as ISection) : null;
        }
    },
    ['section-content'],
    { revalidate: 3600, tags: ['content'] }
);

export async function getAllSections(): Promise<ISection[]> {
    try {
        await dbConnect();
        const sections = await Section.find({}).sort({ name: 1 }).lean();
        return sections.map(s => ({
            ...s,
            _id: s._id.toString(),
            createdAt: s.createdAt,
            updatedAt: s.updatedAt
        })) as unknown as ISection[];
    } catch (error) {
        console.error('getAllSections database connection failed, returning fallback static list:', error);
        return Object.values(STATIC_FALLBACK_SECTIONS) as ISection[];
    }
}

export function getSectionImage(section: ISection | null, type: 'desktop' | 'mobile' = 'desktop'): string | null {
    if (!section || !section.images) return null;
    const image = section.images.find(img => img.type === type);
    // Fallback to desktop if mobile not found, or first image
    if (!image && type === 'mobile') {
        return section.images.find(img => img.type === 'desktop')?.url || section.images[0]?.url || null;
    }
    return image ? image.url : (section.images[0]?.url || null);
}

export function getCustomField(section: ISection | null, key: string): string | null {
    if (!section || !section.customFields) return null;
    const field = section.customFields.find(f => f.key === key);
    return field ? field.value : null;
}
