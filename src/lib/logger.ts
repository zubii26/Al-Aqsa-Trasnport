import fs from 'fs/promises';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'src', 'data', 'logs.json');

export interface LogEntry {
    id: string;
    action: string;
    details: string;
    timestamp: string;
    ip?: string;
    user?: string;
}

export async function logAction(action: string, details: string, ip?: string, user: string = 'Admin') {
    const entry: LogEntry = {
        id: crypto.randomUUID(),
        action,
        details,
        timestamp: new Date().toISOString(),
        ip,
        user
    };

    try {
        await ensureLogDir();
        let logs: LogEntry[] = [];
        try {
            const data = await fs.readFile(LOG_FILE, 'utf-8');
            logs = JSON.parse(data);
        } catch {
            // File doesn't exist or is empty
        }

        // Keep only last 1000 logs
        logs.unshift(entry);
        if (logs.length > 1000) {
            logs = logs.slice(0, 1000);
        }

        await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
    } catch (error) {
        console.error('Failed to write log:', error);
    }
}

export async function getLogs(): Promise<LogEntry[]> {
    try {
        await fs.access(LOG_FILE);
        const data = await fs.readFile(LOG_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function ensureLogDir() {
    try {
        await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
    } catch {
        // Ignore
    }
}
