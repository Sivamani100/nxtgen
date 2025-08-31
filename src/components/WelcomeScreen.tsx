
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/home`
        }
      });

      if (error) {
        toast.error(error.message);
        console.error('Google sign-in error:', error);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error("Failed to sign in with Google");
    } finally {
      setIsGoogleLoading(false);
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
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full h-12 text-lg"
            disabled={isGoogleLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
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
