
export function downloadCSV(data: any[], filename: string) {
    if (!data || !data.length) {
        console.warn("No data to export");
        return;
    }

    const headers = Object.keys(data[0]);

    // Helper to escape CSV values
    const escape = (val: any) => {
        if (val === null || val === undefined) return '';
        const str = String(val);
        // If string contains comma, newline or quotes, wrap in quotes and escape internal quotes
        if (str.includes(',') || str.includes('\n') || str.includes('"')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const csvContent = [
        headers.join(','), // Header row
        ...data.map(row =>
            headers.map(header => escape(row[header])).join(',') // Data rows
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
