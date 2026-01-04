'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#EC4899'];

export default function FleetUtilizationChart({ data }: { data: any[] }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Fleet Utilization</h3>
                    <p className="text-xs text-slate-500 font-medium">Bookings per vehicle type</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fontWeight: 'bold', fill: '#64748B' }}
                        width={100}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar
                        dataKey="count"
                        radius={[0, 10, 10, 0]}
                        barSize={20}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Most Used</p>
                    <p className="text-sm font-black text-slate-900">{data[0]?.name || '---'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Units</p>
                    <p className="text-sm font-black text-slate-900">{data.reduce((acc, curr) => acc + curr.count, 0)} Bookings</p>
                </div>
            </div>
        </div>
    );
}
