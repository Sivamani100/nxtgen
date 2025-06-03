
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success("Welcome back!");
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-green-600 mb-2">Welcome back!</div>
          <p className="text-gray-600">Ready to gain previous Experience</p>
          
          {/* Illustration */}
          <div className="my-6 flex justify-center">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-gray-500">👩‍💻</div>
                <div className="text-xs text-gray-400 mt-2">Learning Experience</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="text-right">
            <Button
              variant="link"
              onClick={() => navigate('/forgot-password')}
              className="text-green-600 hover:underline p-0 text-sm"
            >
              Forgotten Password ?
            </Button>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <input type="checkbox" id="terms" className="rounded" />
            <Label htmlFor="terms">
              I Agree App{" "}
              <a href="/terms" className="text-green-600 hover:underline">Terms</a>
              {" "}and{" "}
              <a href="/conditions" className="text-green-600 hover:underline">conditions</a>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login and continue"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Button
              variant="link"
              onClick={() => navigate('/signup')}
              className="text-green-600 hover:underline p-0"
            >
              sign up !
            </Button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
