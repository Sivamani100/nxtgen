
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calculator, TrendingUp, BookOpen, Home as HomeIcon, Users, Newspaper, User, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type College = Database['public']['Tables']['colleges']['Row'];

interface Branch {
  name: string;
  seats: number;
  fees_per_year: number;
}

const CollegePredictor = () => {
  const [exam, setExam] = useState('');
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const exams = [
    { value: 'jee-main', label: 'JEE Main' },
    { value: 'jee-advanced', label: 'JEE Advanced' },
    { value: 'neet', label: 'NEET' },
    { value: 'ap-eamcet', label: 'AP EAMCET (EAPCET)' },
    { value: 'ts-eamcet', label: 'TS EAMCET' }
  ];

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'obc', label: 'OBC' },
    { value: 'sc', label: 'SC' },
    { value: 'st', label: 'ST' },
    { value: 'bc_a', label: 'BC-A' },
    { value: 'bc_b', label: 'BC-B' },
    { value: 'bc_c', label: 'BC-C' },
    { value: 'bc_d', label: 'BC-D' },
    { value: 'bc_e', label: 'BC-E' }
  ];

  const branches = [
    'Computer Science Engineering',
    'Electronics and Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology',
    'Chemical Engineering',
    'Biotechnology',
    'Aerospace Engineering',
    'Automobile Engineering'
  ];

  const predictColleges = async () => {
    if (!exam || !rank || !category) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const userRank = parseInt(rank);
      
      // Fetch colleges that accept the selected exam
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .contains('eligible_exams', [exam])
        .not('exam_cutoffs', 'is', null);

      if (error) throw error;

      // Filter colleges based on exam cutoff and branch availability
      const suitableColleges = data?.filter((college) => {
        const examCutoffs = (college.exam_cutoffs && typeof college.exam_cutoffs === 'object') 
          ? (college.exam_cutoffs as Record<string, Record<string, number>>)
          : {};
        
        // Check if exam cutoff exists for this exam
        if (!examCutoffs[exam]) {
          return false;
        }

        // Check if user's rank is within cutoff for their category
        const cutoffRank = examCutoffs[exam][category];
        if (!cutoffRank || userRank > cutoffRank) {
          return false;
        }

        // If branch is selected, check branch availability
        if (selectedBranch) {
          const branches: Branch[] = Array.isArray(college.branches_offered) 
            ? (college.branches_offered as unknown as Branch[])
            : [];
          const hasBranch = branches.some((branch) => branch.name === selectedBranch);
          if (!hasBranch) {
            return false;
          }
        }

        return true;
      }) || [];

      setColleges(suitableColleges);
      
      if (suitableColleges.length === 0) {
        toast.error('No colleges found matching your criteria. Try adjusting your filters.');
      } else {
        toast.success(`Found ${suitableColleges.length} colleges matching your criteria!`);
      }
    } catch (error) {
      console.error('Error predicting colleges:', error);
      toast.error('Failed to predict colleges');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 border-b-2 border-green-100">
        <div className="max-w-md mx-auto flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate('/predictor')} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">College Predictor</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Predictor Form */}
        <Card className="p-6 mb-6 bg-white shadow-xl border-2 border-blue-200">
          <div className="flex items-center mb-4">
            <GraduationCap className="w-7 h-7 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Find Your Colleges</h2>
          </div>
          
          <div className="space-y-4">
            {/* Exam Selection */}
            <div>
              <Label htmlFor="exam" className="text-base font-semibold text-gray-900">Select Exam</Label>
              <Select value={exam} onValueChange={setExam}>
                <SelectTrigger className="border-2 border-blue-200 focus:border-blue-400">
                  <SelectValue placeholder="Choose exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((examOption) => (
                    <SelectItem key={examOption.value} value={examOption.value}>
                      {examOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Branch Selection (Optional) */}
            <div>
              <Label htmlFor="branch" className="text-base font-semibold text-gray-900">Select Branch (Optional)</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400">
                  <SelectValue placeholder="Choose branch (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rank Input */}
            <div>
              <Label htmlFor="rank" className="text-base font-semibold text-gray-900">Your Rank</Label>
              <Input
                id="rank"
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="Enter your rank"
                className="text-base border-2 border-green-200 focus:border-green-400"
              />
            </div>

            {/* Category Selection */}
            <div>
              <Label htmlFor="category" className="text-base font-semibold text-gray-900">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-2 border-indigo-200 focus:border-indigo-400">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={predictColleges} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg font-semibold py-3 shadow-lg"
            >
              <Calculator className="w-5 h-5 mr-2" />
              {loading ? 'Predicting...' : 'Predict Colleges'}
            </Button>
          </div>
        </Card>

        {/* Results */}
        {colleges.length > 0 && (
          <Card className="p-6 bg-white shadow-xl border-2 border-green-200">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-7 h-7 text-green-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">Predicted Colleges ({colleges.length})</h3>
            </div>
            
            <div className="space-y-4">
              {colleges.map((college) => {
                const branches: Branch[] = Array.isArray(college.branches_offered) 
                  ? (college.branches_offered as unknown as Branch[])
                  : [];
                const examCutoffs = (college.exam_cutoffs && typeof college.exam_cutoffs === 'object') 
                  ? (college.exam_cutoffs as Record<string, Record<string, number>>)
                  : {};
                const cutoffRank = examCutoffs?.[exam]?.[category];

                return (
                  <div 
                    key={college.id} 
                    className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border-2 border-gray-200 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                    onClick={() => navigate(`/college-details/${college.id}`)}
                  >
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{college.name}</h4>
                    <p className="text-base font-medium text-gray-700 mb-2">{college.location}</p>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">{college.type}</span>
                      <span className="font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                        ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L/year
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">
                        {exam.toUpperCase()} Cutoff: {cutoffRank?.toLocaleString() || 'N/A'}
                      </span>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-indigo-200">
                        {category.toUpperCase()}
                      </span>
                    </div>
                    {selectedBranch && (
                      <div className="text-xs text-gray-600 mt-2 bg-yellow-50 p-2 rounded">
                        Branch: {selectedBranch}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-evenly gap-2 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-blue-600"
              onClick={() => navigate('/home')}
            >
              <HomeIcon className="w-7 h-7" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-purple-600"
              onClick={() => navigate('/colleges')}
            >
              <Users className="w-7 h-7" />
              <span className="text-xs">Colleges</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-green-600 bg-green-50"
            >
              <BookOpen className="w-7 h-7" />
              <span className="text-xs">Predictor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-orange-600"
              onClick={() => navigate('/news')}
            >
              <Newspaper className="w-7 h-7" />
              <span className="text-xs">News</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-indigo-600"
              onClick={() => navigate('/profile')}
            >
              <User className="w-7 h-7" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegePredictor;
