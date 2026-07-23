export type UrgencyBucket = 'overdue' | 'urgent' | 'soon' | 'upcoming' | 'done';

export function parseRiyadhTimeToUTC(dateStr?: string, timeStr?: string): Date | null {
    if (!dateStr) return null;
    
    // Format: YYYY-MM-DD
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return null;
    
    let hours = 0, minutes = 0;
    if (timeStr) {
        // Handles HH:mm or HH:mm:ss
        const parts = timeStr.split(':').map(Number);
        hours = parts[0] || 0;
        minutes = parts[1] || 0;
    }
    
    // Create date in UTC
    // Riyadh is UTC+3. So 14:00 Riyadh = 11:00 UTC.
    const utcHours = hours - 3;
    
    const utcDate = new Date(Date.UTC(year, month - 1, day, utcHours, minutes, 0));
    if (isNaN(utcDate.getTime())) return null;
    
    return utcDate;
}

export interface UrgencyResult {
  bucket: UrgencyBucket;
  needsAction: boolean;
  hoursUntilPickup: number;   // negative if in the past
  label: string;              // human-facing, e.g. "In 2 days" / "Overdue by 3h"
}

const URGENT_HOURS = 48;
const SOON_HOURS = 24 * 7; // 168 hours

/**
 * Helper to format human-readable time labels
 */
function formatLabel(hours: number): string {
    const absHours = Math.abs(hours);
    
    let timeStr = "";
    if (absHours < 1) {
        const mins = Math.round(absHours * 60);
        timeStr = `${mins} min${mins === 1 ? '' : 's'}`;
    } else if (absHours < 24) {
        const hrs = Math.round(absHours);
        timeStr = `${hrs} hr${hrs === 1 ? '' : 's'}`;
    } else {
        const days = Math.round(absHours / 24);
        timeStr = `${days} day${days === 1 ? '' : 's'}`;
    }

    if (hours < 0) {
        return `Overdue by ${timeStr}`;
    } else if (hours === 0) {
        return 'Pickup is now';
    } else {
        return `In ${timeStr}`;
    }
}

/**
 * Calculates the urgency bucket and whether immediate action is needed for a booking.
 * A pure function using the single-source-of-truth pickupDateTime (UTC).
 * 
 * @param pickupDateTime The UTC date object representing the exact pickup moment
 * @param status The current booking status
 * @param now An optional Date representing "now" (useful for testing or syncing with UI)
 */
export function getBookingUrgency(
  pickupDateTime: Date,
  status: string,
  now: Date = new Date()
): UrgencyResult {
  const terminal = status === 'completed' || status === 'cancelled';
  const hoursUntilPickup = (pickupDateTime.getTime() - now.getTime()) / 3_600_000;

  if (terminal) {
    return { bucket: 'done', needsAction: false, hoursUntilPickup, label: status };
  }

  let bucket: UrgencyBucket;
  if (hoursUntilPickup < 0) {
      bucket = 'overdue';
  } else if (hoursUntilPickup <= URGENT_HOURS) {
      bucket = 'urgent';
  } else if (hoursUntilPickup <= SOON_HOURS) {
      bucket = 'soon';
  } else {
      bucket = 'upcoming';
  }

  // Pending bookings that are urgent or overdue require immediate attention
  const actionable = status === 'pending';
  const needsAction = actionable && (bucket === 'urgent' || bucket === 'overdue');

  return { bucket, needsAction, hoursUntilPickup, label: formatLabel(hoursUntilPickup) };
}
