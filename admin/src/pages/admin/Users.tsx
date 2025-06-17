import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { userAPI } from '../../utils/api';
import { UserPlus } from 'lucide-react';

interface User {
  _id: string;
  name?: string;
  username?: string;
  email: string;
  role: string;
  createdAt: string;
}

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers(); // ✅ Clean usage
      const userList = response.data.users;

      if (Array.isArray(userList)) {
        setUsers(userList);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async (userId: string) => {
    try {
      await userAPI.makeAdmin(userId); // ✅ Clean usage

      toast({
        title: 'Success',
        description: 'User promoted to admin',
      });

      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error promoting user:', error);
      toast({
        title: 'Error',
        description: 'Could not promote user',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading users...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {users.map((user) => (
        <Card key={user._id}>
          <CardHeader>
            <CardTitle className="text-lg">
              {user.name || user.username || 'Unnamed User'}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Badge
              variant={user.role === 'admin' ? 'default' : 'outline'}
              className="w-fit"
            >
              {user.role.toUpperCase()}
            </Badge>

            {user.role !== 'admin' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => makeAdmin(user._id)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Promote to Admin
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Users;
