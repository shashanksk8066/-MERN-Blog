import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { blogAPI, userAPI } from '../../utils/api';
import { FileText, Users, TrendingUp } from 'lucide-react';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalUsers: 0,
    recentBlogs: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogsResponse, usersResponse] = await Promise.all([
          blogAPI.getAllBlogs(),
          userAPI.getAllUsers(),
        ]);

        setStats({
          totalBlogs: blogsResponse.data.length,
          totalUsers: usersResponse.data.users?.length || 0,
          recentBlogs: blogsResponse.data.slice(0, 5),
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogs}</div>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>


      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Blog Posts</CardTitle>
          <CardDescription>Latest published articles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentBlogs.map((blog: any) => (
              <div key={blog._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{blog.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    By {blog.author?.name || 'Unknown'} •{' '}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  Published
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
