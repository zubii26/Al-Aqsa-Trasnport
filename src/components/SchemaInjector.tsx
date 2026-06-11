import React from 'react';

// Usage (App Router, Next.js 13+):
//   import SchemaInjector from '@/components/SchemaInjector'
//   <SchemaInjector schemas={[schema1, schema2, schema3]} />

export default function SchemaInjector({ schemas }: { schemas: any[] }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
