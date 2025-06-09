
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleGuestMode = async () => {
    setIsGuestLoading(true);
    try {
      // Sign in with the dummy guest account
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'guestuser@gmail.com',
        password: 'guestuser',
      });

      if (error) {
        toast.error('Failed to enter guest mode. Please try again.');
        console.error('Guest mode error:', error);
        return;
      }

      if (data.user) {
        toast.success('Welcome! You are now in guest mode.');
        navigate('/home');
      }
    } catch (error) {
      console.error('Guest mode error:', error);
      toast.error('Failed to enter guest mode. Please try again.');
    } finally {
      setIsGuestLoading(false);
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
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <Button
            onClick={handleGuestMode}
            variant="secondary"
            className="w-full h-12 text-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            disabled={isGuestLoading}
          >
            {isGuestLoading ? 'Entering Guest Mode...' : 'Continue as Guest'}
          </Button>
        </div>
        
        <div className="mt-8 text-xs text-gray-500">
          Discover scholarships, admissions, events, and educational news
        </div>
        
        <div className="mt-4 text-xs text-gray-400">
          Guest mode gives you full access to all features without registration
        </div>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
