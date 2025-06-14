
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
        toast.success("Login successful!");
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
      <div className="w-full max-w-md">
        <Card className="p-6 lg:p-8 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-sm lg:text-base text-gray-600">Sign in to your NXTGEN account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm lg:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 h-10 lg:h-12 text-sm lg:text-base"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm lg:text-base">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-10 lg:h-12 text-sm lg:text-base pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="text-right">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/forgot-password')}
                className="text-green-600 hover:underline p-0 h-auto text-xs lg:text-sm"
              >
                Forgot Password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full h-10 lg:h-12 bg-green-600 hover:bg-green-700 text-sm lg:text-base font-medium"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-xs lg:text-sm text-gray-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                onClick={() => navigate('/signup')}
                className="text-green-600 hover:underline p-0 h-auto text-xs lg:text-sm"
              >
                Sign up here!
              </Button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
