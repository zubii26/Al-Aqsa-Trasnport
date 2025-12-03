import dbConnect from '@/lib/mongodb';
import { AuditLog } from '@/models';

export interface LogEntry {
    id: string;
    action: string;
    details: string;
    timestamp: string;
    ip?: string;
    user?: string;
}

export async function logAction(action: string, details: string, ip?: string, user: string = 'Admin') {
    try {
        await dbConnect();
        await AuditLog.create({
            action,
            details,
            user,
            entity: 'System', // Default entity
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Failed to write log:', error);
    }
}

export async function getLogs(): Promise<LogEntry[]> {
    try {
        await dbConnect();
        const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(100).lean();

        return logs.map(log => ({
            id: log._id.toString(),
            action: log.action,
            details: log.details || '',
            timestamp: log.timestamp.toISOString(),
            user: log.user,
            ip: '' // IP not stored in AuditLog currently
        }));
    } catch (error) {
        console.error('Failed to fetch logs:', error);
        return [];
    }
}
