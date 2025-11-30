'use client';

import React, { useEffect, useState } from 'react';
import BlogPostForm from '@/components/admin/BlogPostForm';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditBlogPostPage() {
    const params = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/blog/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);
                }
            } catch (error) {
                console.error('Failed to fetch post:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPost();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 size={32} className="animate-spin text-amber-500" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center py-20 text-slate-500">
                Post not found
            </div>
        );
    }

    return <BlogPostForm initialData={post} isEditing />;
}
