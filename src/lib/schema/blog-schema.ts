// ============================================================
// FILE: lib/schema/blog-schema.ts
// Al Aqsa Umrah Transport — Blog Post Schema Generator
// ============================================================

export function generateBlogPostingSchema(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.alaqsaumrahtransport.com/blog/${post.slug || post.id}`
    },
    "headline": post.title,
    "image": [
      post.image.startsWith('http') 
        ? post.image 
        : `https://www.alaqsaumrahtransport.com${post.image.startsWith('/') ? '' : '/'}${post.image}`
    ],
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": "https://www.alaqsaumrahtransport.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://www.alaqsaumrahtransport.com/#organization",
      "name": "Al Aqsa Umrah Transport",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.alaqsaumrahtransport.com/images/logo.png"
      }
    },
    "description": post.excerpt,
    "articleBody": post.content ? post.content.replace(/<[^>]*>?/gm, '') : ""
  };
}

export function generateBlogBreadcrumbSchema(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.alaqsaumrahtransport.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.alaqsaumrahtransport.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://www.alaqsaumrahtransport.com/blog/${post.slug || post.id}`
      }
    ]
  };
}
