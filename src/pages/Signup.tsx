import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          .from("profiles")
          .insert({
            id: data.user.id,
            email: email,
            tutorial_completed: false,
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }

        toast.success("Account created successfully!");
        navigate("/processing");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Illustration Placeholder */}
      <div className="mb-6 flex flex-col items-center">
        <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
          {/* Placeholder for the illustration */}
          <span className="text-gray-500 text-sm">Illustration</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Join our App TODAY!</h1>
        <p className="text-gray-600 text-center mt-2">
          Ready to gain experience our App
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
        {/* Email Field */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <div className="relative mt-1">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              📧
            </span>
          </div>
        </div>

        {/* Password Field */}
        <div>
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
              ) : (
                <Eye className="w-4 h-4 text-gray-500" />
              )}
            </Button>
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              🔒
            </span>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            Confirm Password
          </Label>
          <div className="relative mt-1">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
              ) : (
                <Eye className="w-4 h-4 text-gray-500" />
              )}
            </Button>
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              🔒
            </span>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked === true)}
          />
          <Label htmlFor="terms" className="text-sm text-gray-600">
            I agree to App{" "}
            <a href="/terms" className="text-green-600 hover:underline">
              Terms and conditions
            </a>
          </Label>
        </div>

        {/* Signup Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-200"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign and continue"}
        </Button>

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              className="text-green-600 hover:underline p-0"
            >
              Login!
            </Button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
