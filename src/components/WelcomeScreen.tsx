
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-lg">
        <div className="mb-8">
          <div className="text-4xl font-bold text-green-600 mb-2">NXTGEN</div>
          <div className="text-lg font-semibold text-gray-800 mb-2">
            The Courier-Journal of Education
          </div>
          <div className="text-sm text-gray-600">
            Easy to know on Mobile App
          </div>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/signup')}
            className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
          >
            Sign Up
          </Button>
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            className="w-full h-12 text-lg border-green-600 text-green-600 hover:bg-green-50"
          >
            Login
          </Button>
        </div>
        
        <div className="mt-8 text-xs text-gray-500">
          Discover scholarships, admissions, events, and educational news
        </div>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
