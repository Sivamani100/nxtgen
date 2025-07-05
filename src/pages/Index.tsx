
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import WelcomeScreen from "@/components/WelcomeScreen";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import FlashPopup from "@/components/FlashPopup";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFlashPopup, setShowFlashPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkTutorialStatus(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkTutorialStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkTutorialStatus = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('tutorial_completed')
        .eq('id', userId)
        .maybeSingle();

      if (!profile?.tutorial_completed) {
        setShowOnboarding(true);
      } else {
        // Show flash popup for returning users
        setShowFlashPopup(true);
        // Navigate to home after a short delay
        setTimeout(() => {
          navigate('/home');
        }, 100);
      }
    } catch (error) {
      console.error('Error checking tutorial status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTutorialComplete = async () => {
    if (session) {
      await supabase
        .from('profiles')
        .update({ tutorial_completed: true })
        .eq('id', session.user.id);
      
      // Show flash popup after tutorial completion
      setShowOnboarding(false);
      setShowFlashPopup(true);
      
      // Navigate to home after a short delay
      setTimeout(() => {
        navigate('/home');
      }, 100);
    }
  };

  const handleFlashPopupClose = () => {
    setShowFlashPopup(false);
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (session && showOnboarding) {
    return <OnboardingTutorial onComplete={handleTutorialComplete} />;
  }

  if (session && showFlashPopup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <FlashPopup isOpen={showFlashPopup} onClose={handleFlashPopupClose} />
      </div>
    );
  }

  if (session) {
    navigate('/home');
    return null;
  }

  return <WelcomeScreen />;
};

export default Index;
