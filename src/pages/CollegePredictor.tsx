
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, GraduationCap, ArrowLeft } from "lucide-react";
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
      
      console.log('Predicting colleges for:', { exam, userRank, category, selectedBranch });
      
      // Get all colleges first, then filter
      const { data: allColleges, error } = await supabase
        .from('colleges')
        .select('*')
        .not('type', 'ilike', '%polytechnic%')
        .not('type', 'ilike', '%medical%');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched colleges:', allColleges?.length || 0);

      // Simple filtering based on rank ranges
      const suitableColleges = allColleges?.filter((college) => {
        // Basic rank filtering - you can make this more sophisticated
        const generalCutoff = college.cutoff_rank_general;
        const categoryCutoff = category === 'general' ? generalCutoff :
                              category === 'obc' ? college.cutoff_rank_obc :
                              category === 'sc' ? college.cutoff_rank_sc :
                              category === 'st' ? college.cutoff_rank_st :
                              category === 'bc_a' ? college.cutoff_rank_bc_a :
                              category === 'bc_b' ? college.cutoff_rank_bc_b :
                              category === 'bc_c' ? college.cutoff_rank_bc_c :
                              category === 'bc_d' ? college.cutoff_rank_bc_d :
                              category === 'bc_e' ? college.cutoff_rank_bc_e :
                              generalCutoff;

        return categoryCutoff ? userRank <= categoryCutoff : false;
      }) || [];

      console.log('Suitable colleges:', suitableColleges.length);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="flex items-center p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mr-2 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center">
            <GraduationCap className="w-6 h-6 text-blue-600 mr-2" />
            <h1 className="text-lg font-bold text-gray-900">College Predictor</h1>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center mb-2">
            <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">College Predictor</h1>
          </div>
          <p className="text-gray-600">Find colleges based on your entrance exam rank and preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-24 lg:pb-4">
        {/* Predictor Form */}
        <Card className="p-4 lg:p-8 mb-6 bg-white shadow-xl border-t-4 border-blue-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Exam Selection */}
            <div>
              <Label htmlFor="exam" className="text-sm lg:text-base font-semibold text-gray-900 mb-2 block">Select Exam</Label>
              <Select value={exam} onValueChange={setExam}>
                <SelectTrigger className="h-10 lg:h-12 border-2 border-gray-200 focus:border-blue-500">
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
              <Label htmlFor="rank" className="text-sm lg:text-base font-semibold text-gray-900 mb-2 block">Your Rank</Label>
              <Input
                id="rank"
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="Enter your rank"
                className="h-10 lg:h-12 text-sm lg:text-base border-2 border-gray-200 focus:border-green-500"
              />
            </div>

            {/* Category Selection */}
            <div>
              <Label htmlFor="category" className="text-sm lg:text-base font-semibold text-gray-900 mb-2 block">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-10 lg:h-12 border-2 border-gray-200 focus:border-indigo-500">
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
              <Label htmlFor="branch" className="text-sm lg:text-base font-semibold text-gray-900 mb-2 block">Select Branch (Optional)</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="h-10 lg:h-12 border-2 border-gray-200 focus:border-purple-500">
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
            className="w-full mt-6 lg:mt-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm lg:text-lg font-semibold py-3 lg:py-4 shadow-lg"
          >
            <Calculator className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            {loading ? 'Predicting...' : 'Predict Colleges'}
          </Button>
        </Card>

        {/* Results */}
        {colleges.length > 0 && (
          <Card className="p-4 lg:p-8 bg-white shadow-xl border-t-4 border-green-500">
            <div className="flex items-center mb-4 lg:mb-6">
              <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mr-3" />
              <h3 className="text-lg lg:text-2xl font-bold text-gray-900">Predicted Colleges ({colleges.length})</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {colleges.map((college) => {
                const categoryCutoff = category === 'general' ? college.cutoff_rank_general :
                                     category === 'obc' ? college.cutoff_rank_obc :
                                     category === 'sc' ? college.cutoff_rank_sc :
                                     category === 'st' ? college.cutoff_rank_st :
                                     category === 'bc_a' ? college.cutoff_rank_bc_a :
                                     category === 'bc_b' ? college.cutoff_rank_bc_b :
                                     category === 'bc_c' ? college.cutoff_rank_bc_c :
                                     category === 'bc_d' ? college.cutoff_rank_bc_d :
                                     category === 'bc_e' ? college.cutoff_rank_bc_e :
                                     college.cutoff_rank_general;

                const availableBranches = getBranchPrediction(college, parseInt(rank), category);

                return (
                  <div 
                    key={college.id} 
                    className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 lg:p-6 rounded-xl border-2 border-gray-200 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                    onClick={() => navigate(`/college-details/${college.id}`)}
                  >
                    <h4 className="text-base lg:text-xl font-bold text-gray-900 mb-2">{college.name}</h4>
                    <p className="text-sm lg:text-base font-medium text-gray-700 mb-3">{college.location}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 bg-gray-100 px-2 lg:px-3 py-1 rounded text-xs lg:text-sm">{college.type}</span>
                        <span className="font-semibold text-green-600 bg-green-100 px-2 lg:px-3 py-1 rounded text-xs lg:text-sm">
                          ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L/year
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-medium bg-blue-100 px-2 lg:px-3 py-1 rounded text-xs lg:text-sm">
                          Cutoff: {categoryCutoff?.toLocaleString() || 'N/A'}
                        </span>
                        <span className="text-xs lg:text-sm bg-indigo-100 text-indigo-700 px-2 lg:px-3 py-1 rounded border border-indigo-200">
                          {category.toUpperCase()}
                        </span>
                      </div>

                      {availableBranches.length > 0 && (
                        <div className="bg-green-50 p-2 lg:p-3 rounded border border-green-200">
                          <p className="text-xs lg:text-sm font-semibold text-green-800 mb-2">Branches you can get:</p>
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
                        <div className="text-xs lg:text-sm text-gray-600 bg-yellow-50 p-2 rounded">
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
