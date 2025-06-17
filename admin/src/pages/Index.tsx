
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Blog</h1>
        <p className="text-xl text-muted-foreground">Your destination for amazing content</p>
        <div className="space-y-4">
          <Button asChild>
            <Link to="/admin/login">Admin Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
