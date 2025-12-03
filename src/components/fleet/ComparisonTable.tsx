'use client';

import styles from './ComparisonTable.module.css';


export default function ComparisonTable() {

    const data = [
        { name: 'Toyota Camry', type: 'camry', capacity: '4', comfort: 'High', price: 'From SAR 200' },
        { name: 'Hyundai Starex', type: 'starex', capacity: '7', comfort: 'Standard', price: 'From SAR 250' },
        { name: 'Hyundai Staria', type: 'staria', capacity: '7', comfort: 'High', price: 'From SAR 300' },
        { name: 'GMC Yukon', type: 'gmc', capacity: '7', comfort: 'Premium', price: 'From SAR 400' },
        { name: 'Toyota Hiace', type: 'hiace', capacity: '11', comfort: 'Standard', price: 'From SAR 350' },
        { name: 'Toyota Coaster', type: 'coaster', capacity: '21', comfort: 'Standard', price: 'From SAR 600' },
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.sectionTitle}>Compare Our Vehicles</h2>
                <div className={`${styles.tableWrapper} glass-panel`}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Vehicle Type</th>
                                <th>Capacity</th>
                                <th>Comfort Level</th>
                                <th>Starting Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row) => (
                                <tr key={row.type}>
                                    <td className="font-bold">{row.name}</td>
                                    <td>{row.capacity}</td>
                                    <td>{row.comfort}</td>
                                    <td>{row.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
