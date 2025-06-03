
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import WelcomeScreen from "@/components/WelcomeScreen";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
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
        .single();

      if (!profile?.tutorial_completed) {
        setShowOnboarding(true);
      } else {
        navigate('/home');
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
      
      navigate('/home');
    }
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

  if (session) {
    navigate('/home');
    return null;
  }

  return <WelcomeScreen />;
};

export default Index;
