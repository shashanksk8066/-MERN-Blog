import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { BlogPost, Comment } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { postsAPI, commentsAPI } from '@/services/api';

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const { data: postData, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsAPI.getPostById(id!),
    enabled: !!id,
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => commentsAPI.getCommentsByPost(id!),
    enabled: !!id,
  });

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => commentsAPI.addComment(id!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setNewComment('');
      toast({
        title: "Comment posted!",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;
    addCommentMutation.mutate(newComment);
  };

  if (postLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (postError || !postData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const post: BlogPost = postData?.post || postData;
  const comments: Comment[] = commentsData?.comments || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="mb-12">
          <div className="mb-6">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 md:h-96 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-2 flex-wrap">
              <Badge variant="secondary">{post.category}</Badge>
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://static.vecteezy.com/system/resources/previews/000/550/980/non_2x/user-icon-vector.jpg" alt={post.author} />
                </Avatar>
                <div>
                  <p className="font-medium">{post.authorName}</p>
                  <p className="text-sm text-muted-foreground">{post.publishedAt}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} min read</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{comments.length} comments</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

          {isAuthenticated ? (
            <Card className="mb-8">
              <CardHeader>
                <h3 className="text-lg font-semibold">Add a comment</h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    required
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={addCommentMutation.isPending}>
                      {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Please log in to post a comment.
                </p>
              </CardContent>
            </Card>
          )}

          {commentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading comments...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                        <AvatarFallback>{comment.author?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{comment.author}</h4>
                          <span className="text-sm text-muted-foreground">{comment.createdAt}</span>
                        </div>
                        <p className="text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
