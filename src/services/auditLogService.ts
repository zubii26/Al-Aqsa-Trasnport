import dbConnect from '@/lib/mongodb';
import { AuditLog } from '@/models';

export const auditLogService = {
    async log(data: {
        action: string;
        entity: string;
        entityId?: string;
        details?: string;
        user: string;
    }) {
        try {
            await dbConnect();
            await AuditLog.create({
                ...data,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Failed to create audit log:', error);
            // Don't throw error to prevent blocking main action
        }
    },

    async getLogs(limitCount = 100) {
        try {
            await dbConnect();
            const logs = await AuditLog.find({})
                .sort({ timestamp: -1 })
                .limit(limitCount)
                .lean();

            return logs.map(log => ({
                id: log._id.toString(),
                action: log.action,
                entity: log.entity,
                entityId: log.entityId,
                details: log.details,
                user: log.user,
                timestamp: log.timestamp
            }));
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
            return [];
        }
    }
};
