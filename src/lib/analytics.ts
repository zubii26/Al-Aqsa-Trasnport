type GtagEvent = {
    action: string;
    category: string;
    label: string;
    value?: number;
}; // eslint-disable-next-line @typescript-eslint/no-explicit-any

export const sendGAEvent = ({ action, category, label, value }: GtagEvent) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

export const trackConversion = (type: 'whatsapp' | 'call' | 'email' | 'other', location: string) => {
    sendGAEvent({
        action: 'conversion',
        category: 'Contact',
        label: `${type}_${location}`,
    });
};

export const trackFleetView = (vehicleName: string) => {
    sendGAEvent({
        action: 'view_item',
        category: 'Fleet',
        label: vehicleName,
    });
};
