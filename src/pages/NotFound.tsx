
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl font-bold text-red-600">404</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Page not found</h1>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or may have been moved.</p>
        <Button 
          onClick={() => navigate('/home')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
