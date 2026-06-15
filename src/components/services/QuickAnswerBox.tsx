import React from 'react';
import Link from 'next/link';

interface QuickAnswerBoxProps {
  title: string;
  summary: string;
  features: { label: string; value: string | React.ReactNode }[];
  ctaText: string;
  ctaLink: string;
}

export default function QuickAnswerBox({ title, summary, features, ctaText, ctaLink }: QuickAnswerBoxProps) {
  return (
    <div className="geo-quick-answer">
      <h3>Quick Facts: {title}</h3>
      <p>{summary}</p>
      <ul>
        {features.map((feature, index) => (
          <li key={index}>
            <strong>{feature.label}:</strong> {feature.value}
          </li>
        ))}
      </ul>
      <Link href={ctaLink} className="geo-qa-btn">
        {ctaText}
      </Link>
    </div>
  );
}
