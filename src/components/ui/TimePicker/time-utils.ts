export const getAngleFromTime = (value: number, type: 'hours' | 'minutes'): number => {
    if (type === 'hours') {
        // 12 hours = 360 degrees, 1 hour = 30 degrees
        // Adjust for 0 (12 AM/PM) -> 360/0 degrees
        return (value % 12) * 30;
    }
    // 60 minutes = 360 degrees, 1 minute = 6 degrees
    return value * 6;
};

export const getTimeFromAngle = (angle: number, type: 'hours' | 'minutes'): number => {
    // Normalize angle to 0-360
    let normalizedAngle = angle % 360;
    if (normalizedAngle < 0) normalizedAngle += 360;

    if (type === 'hours') {
        const hour = Math.round(normalizedAngle / 30) % 12;
        return hour === 0 ? 12 : hour; // Return 12 for 0 degrees
    }

    return Math.round(normalizedAngle / 6) % 60;
};

export const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const strMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${strMinutes} ${ampm}`;
};

export const setTimeDate = (baseDate: Date, hours: number, minutes: number): Date => {
    const newDate = new Date(baseDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    return newDate;
};
