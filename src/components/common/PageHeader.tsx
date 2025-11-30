import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
    return (
        <div style={{
            background: "linear-gradient(rgba(6, 78, 59, 0.9), rgba(6, 78, 59, 0.8)), url('https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=1920&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            padding: '6rem 0',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <div className="container">
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    lineHeight: 1.1,
                    background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    {title}
                </h1>
                {subtitle && (
                    <p style={{
                        fontSize: '1.25rem',
                        opacity: 0.9,
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
