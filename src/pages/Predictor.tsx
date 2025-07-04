
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const Predictor = () => {
  const [activeTab, setActiveTab] = useState("college");
  
  // College Predictor states
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("");
  const [exam, setExam] = useState("");
  
  // Rank Predictor states
  const [rankExam, setRankExam] = useState("");
  const [rankCategory, setRankCategory] = useState("");
  const [marks, setMarks] = useState("");

  const handleFindColleges = () => {
    if (!exam || !rank || !category) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Finding colleges for you!");
  };

  const handlePredictRank = () => {
    if (!rankExam || !rankCategory || !marks) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Predicting your rank!");
  };

  const renderCollegePredictor = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <GraduationCap className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Find Your Colleges</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Select Exam
          </Label>
          <Select value={exam} onValueChange={setExam}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Choose exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jee-main">JEE Main</SelectItem>
              <SelectItem value="jee-advanced">JEE Advanced</SelectItem>
              <SelectItem value="neet">NEET</SelectItem>
              <SelectItem value="eamcet">EAMCET</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Your Rank
          </Label>
          <Input
            type="number"
            placeholder="Enter your rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="h-12"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select category" />
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

        <Button 
          onClick={handleFindColleges}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
        >
          <GraduationCap className="w-4 h-4 mr-2" />
          Find Colleges
        </Button>
      </div>
    </div>
  );

  const renderRankPredictor = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <TrendingUp className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold text-gray-900">Predict Your Rank</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Select Exam
          </Label>
          <Select value={rankExam} onValueChange={setRankExam}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Choose exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jee-main">JEE Main</SelectItem>
              <SelectItem value="jee-advanced">JEE Advanced</SelectItem>
              <SelectItem value="neet">NEET</SelectItem>
              <SelectItem value="eamcet">EAMCET</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Category
          </Label>
          <Select value={rankCategory} onValueChange={setRankCategory}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select category" />
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

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Marks
          </Label>
          <Input
            type="number"
            placeholder="Enter your marks"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            className="h-12"
          />
        </div>

        <Button 
          onClick={handlePredictRank}
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Predict Rank
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Mobile Header with tabs */}
      <div className="lg:hidden bg-white shadow-sm border-b mt-16">
        <div className="flex bg-gray-100 mx-4 mt-4 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("college")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center ${
              activeTab === "college"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            College Predictor
          </button>
          <button
            onClick={() => setActiveTab("rank")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center ${
              activeTab === "rank"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Rank Predictor
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center mb-2">
            <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Predictor</h1>
          </div>
          <p className="text-gray-600">Get personalized predictions based on your performance</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <Card className="bg-white shadow-lg border-0">
          {/* Desktop Tabs */}
          <div className="hidden lg:flex bg-gray-100 rounded-lg p-1 m-6 mb-0">
            <button
              onClick={() => setActiveTab("college")}
              className={`flex-1 py-4 px-6 rounded-md text-base font-medium transition-all flex items-center justify-center ${
                activeTab === "college"
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              College Predictor
            </button>
            <button
              onClick={() => setActiveTab("rank")}
              className={`flex-1 py-4 px-6 rounded-md text-base font-medium transition-all flex items-center justify-center ${
                activeTab === "rank"
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Rank Predictor
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "college" ? renderCollegePredictor() : renderRankPredictor()}
        </Card>
      </div>
    </div>
  );
};

export default Predictor;
