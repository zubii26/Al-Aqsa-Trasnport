import dbConnect from '@/lib/mongodb';
import { AuditLog } from '@/models';

export interface LogEntry {
    id: string;
    action: string;
    details: string;
    timestamp: string;
    user?: string;
    entity?: string;
    ip?: string;
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

export async function getLogs(page: number = 1, limit: number = 20, search: string = ''): Promise<{ logs: LogEntry[], total: number, pages: number }> {
    try {
        await dbConnect();

        const query: any = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { action: searchRegex },
                { details: searchRegex },
                { user: searchRegex }
            ];
        }

        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            AuditLog.find(query)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            AuditLog.countDocuments(query)
        ]);

        const formattedLogs = logs.map(log => ({
            id: log._id.toString(),
            action: log.action,
            details: log.details || '',
            timestamp: log.timestamp.toISOString(),
            user: log.user,
            entity: log.entity,
            ip: ''
        }));

        return {
            logs: formattedLogs,
            total,
            pages: Math.ceil(total / limit)
        };
    } catch (error) {
        console.error('Failed to fetch logs:', error);
        return { logs: [], total: 0, pages: 0 };
    }
}
