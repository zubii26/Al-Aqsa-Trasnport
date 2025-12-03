import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
    return (
        <div
            className="relative bg-cover bg-center text-white py-24 min-h-[400px] flex items-center text-center"
            style={{
                backgroundImage: "linear-gradient(rgba(6, 78, 59, 0.9), rgba(6, 78, 59, 0.8)), url('https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=1920&auto=format&fit=crop')"
            }}
        >
            <div className="container">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
