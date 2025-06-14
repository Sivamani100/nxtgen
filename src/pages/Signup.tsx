
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            tutorial_completed: false,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        toast.success("Account created successfully!");
        navigate('/processing');
      }
    } catch (error) {
      console.error('Signup error:', error);
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
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-sm lg:text-base text-gray-600">Join NXTGEN to discover educational opportunities</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
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

            <div>
              <Label htmlFor="confirmPassword" className="text-sm lg:text-base">Confirm Password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="h-10 lg:h-12 text-sm lg:text-base pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-xs lg:text-sm leading-relaxed">
                I agree to the{" "}
                <a href="/terms" className="text-green-600 hover:underline">
                  Terms and Conditions
                </a>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-10 lg:h-12 bg-green-600 hover:bg-green-700 text-sm lg:text-base font-medium"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Signup and continue"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-xs lg:text-sm text-gray-600">
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={() => navigate('/login')}
                className="text-green-600 hover:underline p-0 h-auto text-xs lg:text-sm"
              >
                Login!
              </Button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
