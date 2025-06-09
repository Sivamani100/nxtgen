
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleGuestMode = async () => {
    try {
      // Create an anonymous session for guest users
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("Welcome! You're using guest mode");
        navigate('/home');
      }
    } catch (error) {
      console.error('Guest mode error:', error);
      toast.error("Failed to enter guest mode");
    }
  };

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
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>
          <Button
            onClick={handleGuestMode}
            variant="ghost"
            className="w-full h-12 text-lg text-gray-600 hover:bg-gray-50 border border-gray-300"
          >
            Continue as Guest
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
