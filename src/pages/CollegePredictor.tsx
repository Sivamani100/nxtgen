
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calculator, TrendingUp, GraduationCap } from "lucide-react";
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

  const getBranchPrediction = (college: College, userRank: number, category: string) => {
    const branchCutoffs = (college.branch_cutoff_predictions && typeof college.branch_cutoff_predictions === 'object') 
      ? (college.branch_cutoff_predictions as Record<string, Record<string, number>>)
      : {};
    
    const availableBranches = Object.entries(branchCutoffs)
      .filter(([branch, cutoffs]) => {
        const cutoff = (cutoffs as Record<string, number>)[category];
        return cutoff && userRank <= cutoff;
      })
      .map(([branch]) => branch);

    return availableBranches;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4 pb-24 lg:pb-4">
        {/* Predictor Form */}
        <Card className="p-8 mb-6 bg-white shadow-lg border border-gray-200">
          <div className="flex items-center mb-6">
            <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">College Predictor</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exam Selection */}
            <div>
              <Label htmlFor="exam" className="text-lg font-semibold text-gray-900 mb-2 block">Select Exam</Label>
              <Select value={exam} onValueChange={setExam}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500">
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

            {/* Rank Input */}
            <div>
              <Label htmlFor="rank" className="text-lg font-semibold text-gray-900 mb-2 block">Your Rank</Label>
              <Input
                id="rank"
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="Enter your rank"
                className="h-12 text-lg border-2 border-gray-200 focus:border-green-500"
              />
            </div>

            {/* Category Selection */}
            <div>
              <Label htmlFor="category" className="text-lg font-semibold text-gray-900 mb-2 block">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-indigo-500">
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

            {/* Branch Selection (Optional) */}
            <div>
              <Label htmlFor="branch" className="text-lg font-semibold text-gray-900 mb-2 block">Select Branch (Optional)</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-500">
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
          </div>

          <Button 
            onClick={predictColleges} 
            disabled={loading}
            className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg font-semibold py-4 shadow-lg"
          >
            <Calculator className="w-5 h-5 mr-2" />
            {loading ? 'Predicting...' : 'Predict Colleges'}
          </Button>
        </Card>

        {/* Results */}
        {colleges.length > 0 && (
          <Card className="p-8 bg-white shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Predicted Colleges ({colleges.length})</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {colleges.map((college) => {
                const examCutoffs = (college.exam_cutoffs && typeof college.exam_cutoffs === 'object') 
                  ? (college.exam_cutoffs as Record<string, Record<string, number>>)
                  : {};
                const cutoffRank = examCutoffs?.[exam]?.[category];
                const availableBranches = getBranchPrediction(college, parseInt(rank), category);

                return (
                  <div 
                    key={college.id} 
                    className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                    onClick={() => navigate(`/college-details/${college.id}`)}
                  >
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{college.name}</h4>
                    <p className="text-lg font-medium text-gray-700 mb-3">{college.location}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded">{college.type}</span>
                        <span className="font-semibold text-green-600 bg-green-100 px-3 py-1 rounded">
                          ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L/year
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-medium bg-blue-100 px-3 py-1 rounded">
                          {exam.toUpperCase()} Cutoff: {cutoffRank?.toLocaleString() || 'N/A'}
                        </span>
                        <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded border border-indigo-200">
                          {category.toUpperCase()}
                        </span>
                      </div>

                      {availableBranches.length > 0 && (
                        <div className="bg-green-50 p-3 rounded border border-green-200">
                          <p className="text-sm font-semibold text-green-800 mb-2">Branches you can get:</p>
                          <div className="flex flex-wrap gap-1">
                            {availableBranches.slice(0, 3).map((branch, index) => (
                              <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                {branch}
                              </span>
                            ))}
                            {availableBranches.length > 3 && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                +{availableBranches.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedBranch && (
                        <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                          Filtered for: {selectedBranch}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CollegePredictor;
