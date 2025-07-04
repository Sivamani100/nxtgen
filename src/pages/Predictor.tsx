
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, GraduationCap, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const Predictor = () => {
  const [activeTab, setActiveTab] = useState("college");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    if (!rank || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    
    // Simulate prediction logic
    setTimeout(() => {
      const mockResults = [
        {
          name: "IIT Hyderabad",
          branch: "Computer Science",
          probability: "High",
          cutoff: "1200",
          fees: "2.5L"
        },
        {
          name: "NIT Warangal", 
          branch: "Electronics",
          probability: "Medium",
          cutoff: "2500",
          fees: "1.8L"
        },
        {
          name: "JNTU Hyderabad",
          branch: "Information Technology", 
          probability: "High",
          cutoff: "5000",
          fees: "1.2L"
        }
      ];
      
      setResults(mockResults);
      setLoading(false);
      toast.success("Prediction generated successfully!");
    }, 1500);
  };

  const renderCollegePredictor = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rank" className="text-sm font-medium text-gray-700 mb-2 block">
            Your Rank
          </Label>
          <Input
            id="rank"
            type="number"
            placeholder="Enter your rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="h-12"
          />
        </div>
        
        <div>
          <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select your category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="obc">OBC</SelectItem>
              <SelectItem value="sc">SC</SelectItem>
              <SelectItem value="st">ST</SelectItem>
              <SelectItem value="ews">EWS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={handlePredict}
        disabled={loading}
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium"
      >
        {loading ? "Predicting..." : "Predict Colleges"}
      </Button>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Predicted Colleges</h3>
          {results.map((result, index) => (
            <Card key={index} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900">{result.name}</h4>
                <Badge 
                  className={
                    result.probability === "High" 
                      ? "bg-green-100 text-green-800" 
                      : result.probability === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {result.probability}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                <span>Branch: {result.branch}</span>
                <span>Cutoff: {result.cutoff}</span>
                <span>Fees: {result.fees}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderRankPredictor = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <TrendingUp className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Rank Predictor</h3>
        <p className="text-gray-600">
          Enter your exam details to predict your expected rank
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Exam Score
          </Label>
          <Input
            type="number"
            placeholder="Enter your score"
            className="h-12"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Exam Type
          </Label>
          <Select>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jee-main">JEE Main</SelectItem>
              <SelectItem value="jee-advanced">JEE Advanced</SelectItem>
              <SelectItem value="bitsat">BITSAT</SelectItem>
              <SelectItem value="eamcet">EAMCET</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium">
        Predict Rank
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Mobile Header with tabs */}
      <div className="lg:hidden bg-white shadow-sm border-b mt-16">
        <div className="p-4">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab("college")}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === "college"
                  ? "bg-gradient-to-r from-blue-400 to-green-400 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <GraduationCap className="w-4 h-4 inline mr-2" />
              College Predictor
            </button>
            <button
              onClick={() => setActiveTab("rank")}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === "rank"
                  ? "bg-gradient-to-r from-green-400 to-blue-400 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Rank Predictor
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center mb-2">
            <Calculator className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">College Predictor</h1>
          </div>
          <p className="text-gray-600">Get personalized college predictions based on your rank</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <Card className="bg-white shadow-lg border-0">
          <div className="p-6 lg:p-8">
            {/* Desktop Tabs */}
            <div className="hidden lg:flex bg-gray-100 rounded-lg p-1 mb-8">
              <button
                onClick={() => setActiveTab("college")}
                className={`flex-1 py-4 px-6 rounded-md text-base font-medium transition-all ${
                  activeTab === "college"
                    ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <GraduationCap className="w-5 h-5 inline mr-2" />
                College Predictor
              </button>
              <button
                onClick={() => setActiveTab("rank")}
                className={`flex-1 py-4 px-6 rounded-md text-base font-medium transition-all ${
                  activeTab === "rank"
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <TrendingUp className="w-5 h-5 inline mr-2" />
                Rank Predictor
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "college" ? renderCollegePredictor() : renderRankPredictor()}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Predictor;
