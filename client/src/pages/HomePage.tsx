import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/types/blog';
import BlogCard from '@/components/BlogCard';
import FilterBar from '@/components/FilterBar';
import { postsAPI, categoriesAPI } from '@/services/api';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Fetch posts
  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postsAPI.getAllPosts({}),
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesAPI.getAllCategories,
  });

  // Fetch tags
  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: categoriesAPI.getAllTags,
  });

  // If API returns simple arrays, use directly
  const categories: string[] = Array.isArray(categoriesData) ? categoriesData : categoriesData?.categories || [];
  const tags: string[] = Array.isArray(tagsData) ? tagsData : tagsData?.tags || [];

  // Format posts
  const posts: BlogPost[] = Array.isArray(postsData) ? postsData : postsData?.posts || [];

  // Filter logic
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => post.tags?.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  useEffect(() => {
    console.log('✅ Filtered posts:', filteredPosts);
    console.log('📁 Categories:', categories);
    console.log('🏷️ Tags:', tags);
  }, [searchTerm, selectedCategory, selectedTags, posts]);

  if (postsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading posts</h1>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to ModernBlog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover insightful articles, tutorials, and thoughts from our community of writers
          </p>
        </div>

        <div className="mb-8">
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            categories={categories}
            tags={tags}
          />
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No articles found matching your criteria.
            </p>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post._id || post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
