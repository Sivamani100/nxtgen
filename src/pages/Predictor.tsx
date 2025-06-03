
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Predictor = () => {
  const [activeTab, setActiveTab] = useState('rank');
  const [formData, setFormData] = useState({
    rank: '',
    course: '',
    branch: '',
    category: '',
    location: '',
    board: '',
    examType: '',
    marks: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    // Mock calculation logic
    if (activeTab === 'rank') {
      // Calculate rank based on marks
      const estimatedRank = Math.floor(Math.random() * 10000) + 1000;
      alert(`Your estimated rank is: ${estimatedRank}`);
    } else {
      // Find colleges based on rank
      alert('Finding colleges for your rank...');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Predict Your College</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto flex">
          <Button
            variant="ghost"
            className={`flex-1 py-3 border-b-2 ${
              activeTab === 'rank' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setActiveTab('rank')}
          >
            Estimate Rank
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 py-3 border-b-2 ${
              activeTab === 'college' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setActiveTab('college')}
          >
            Predict College
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {activeTab === 'rank' ? (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Enter Your Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="board">Board</Label>
                <Select onValueChange={(value) => handleInputChange('board', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your board" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cbse">CBSE</SelectItem>
                    <SelectItem value="icse">ICSE</SelectItem>
                    <SelectItem value="state">State Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="examType">Exam Type</Label>
                <Select onValueChange={(value) => handleInputChange('examType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Exam type" />
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
                <Label htmlFor="marks">Marks Obtained (0-160)</Label>
                <Input
                  id="marks"
                  type="number"
                  placeholder="Enter your marks"
                  value={formData.marks}
                  onChange={(e) => handleInputChange('marks', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your board" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="obc">OBC</SelectItem>
                    <SelectItem value="sc">SC</SelectItem>
                    <SelectItem value="st">ST</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleCalculate}
                className="w-full h-12 bg-green-600 hover:bg-green-700"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Rank
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Find Colleges Based on Rank</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rank">Your Rank</Label>
                <Input
                  id="rank"
                  type="number"
                  placeholder="20,000"
                  value={formData.rank}
                  onChange={(e) => handleInputChange('rank', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="course">Course</Label>
                  <Select onValueChange={(value) => handleInputChange('course', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="btech">B.Tech</SelectItem>
                      <SelectItem value="mbbs">MBBS</SelectItem>
                      <SelectItem value="bds">BDS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Select onValueChange={(value) => handleInputChange('branch', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cse">Computer Science</SelectItem>
                      <SelectItem value="ece">Electronics</SelectItem>
                      <SelectItem value="mech">Mechanical</SelectItem>
                      <SelectItem value="civil">Civil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="obc">OBC</SelectItem>
                      <SelectItem value="sc">SC</SelectItem>
                      <SelectItem value="st">ST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select onValueChange={(value) => handleInputChange('location', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ap">Andhra Pradesh</SelectItem>
                      <SelectItem value="ts">Telangana</SelectItem>
                      <SelectItem value="tn">Tamil Nadu</SelectItem>
                      <SelectItem value="ka">Karnataka</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleCalculate}
                className="w-full h-12 bg-green-600 hover:bg-green-700"
              >
                Find Colleges
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Predictor;
