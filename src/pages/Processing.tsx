
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Processing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-lg">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Processing Please Wait!
          </h2>
          <p className="text-gray-600">
            Setting up your account...
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate('/signup')}
          className="w-full border-green-600 text-green-600 hover:bg-green-50"
        >
          Retry
        </Button>
      </Card>
    </div>
  );
};

export default Processing;
