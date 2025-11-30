import fs from 'fs/promises';
import path from 'path';
import { Route, Vehicle } from './pricing';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'pricing.json');

export interface PricingData {
    routes: Route[];
    vehicles: Omit<Vehicle, 'icon'>[]; // Icons are not serializable
}

export async function getPricingData(): Promise<PricingData> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to read pricing data:', error);
        throw new Error('Failed to load pricing data');
    }
}

export async function savePricingData(data: PricingData): Promise<void> {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Failed to save pricing data:', error);
        throw new Error('Failed to save pricing data');
    }
}
