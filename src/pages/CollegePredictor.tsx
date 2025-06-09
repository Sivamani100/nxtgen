
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Target, Star, MapPin, Home as HomeIcon, Users, BookOpen, Newspaper, User } from "lucide-react";
import { toast } from "sonner";
import { debounce } from "lodash";

interface College {
  id: number;
  name: string;
  location: string;
  rating: number;
  type: string;
  total_fees_min: number;
  total_fees_max: number;
  placement_percentage: number;
  cutoff_rank_general: number;
  cutoff_rank_obc: number;
  cutoff_rank_sc: number;
  cutoff_rank_st: number;
  cutoff_rank_bc_a: number;
  cutoff_rank_bc_b: number;
  cutoff_rank_bc_c: number;
  cutoff_rank_bc_d: number;
  cutoff_rank_bc_e: number;
  state: string;
}

const CollegePredictor = () => {
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('');
  const [examType, setExamType] = useState('');
  const [predictedColleges, setPredictedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const examTypes = [
    { value: 'jee-main', label: 'JEE Main' },
    { value: 'jee-advanced', label: 'JEE Advanced' },
    { value: 'ap-eapcet', label: 'AP EAPCET' },
    { value: 'ts-eamcet', label: 'TS EAMCET' }
  ];

  const categories = [
    { value: 'general', label: 'General/OC' },
    { value: 'obc', label: 'OBC' },
    { value: 'sc', label: 'SC' },
    { value: 'st', label: 'ST' },
    { value: 'bc_a', label: 'BC-A' },
    { value: 'bc_b', label: 'BC-B' },
    { value: 'bc_c', label: 'BC-C' },
    { value: 'bc_d', label: 'BC-D' },
    { value: 'bc_e', label: 'BC-E' }
  ];

  // Debounced predictColleges function to prevent rapid API calls
  const predictColleges = useCallback(
    debounce(async (userRank: string, selectedCategory: string, selectedExamType: string) => {
      if (!userRank || !selectedCategory || !selectedExamType) {
        setError('Please enter your rank, select a category, and choose exam type');
        toast.error('Please enter your rank, select a category, and choose exam type');
        setPredictedColleges([]);
        return;
      }

      const parsedRank = parseInt(userRank);
      if (isNaN(parsedRank) || parsedRank <= 0) {
        setError('Please enter a valid rank');
        toast.error('Please enter a valid rank');
        setPredictedColleges([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const cutoffColumn = `cutoff_rank_${selectedCategory}`;
        
        let query = supabase
          .from('colleges')
          .select('*')
          .gte(cutoffColumn, parsedRank)
          .order(cutoffColumn, { ascending: true });

        // Apply exam type filters
        switch (selectedExamType) {
          case 'jee-advanced':
            // Only IITs and NITs
            query = query.in('type', ['IIT', 'NIT']);
            break;
          case 'ap-eapcet':
            // Only Andhra Pradesh colleges
            query = query.eq('state', 'Andhra Pradesh');
            break;
          case 'ts-eamcet':
            // Only Telangana colleges
            query = query.eq('state', 'Telangana');
            break;
          case 'jee-main':
            // All colleges in India - no additional filter needed
            break;
          default:
            break;
        }

        query = query.limit(20);

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message || 'Failed to fetch colleges');
        }

        setPredictedColleges(data || []);
        
        if (data && data.length > 0) {
          toast.success(`Found ${data.length} colleges for your rank and exam type!`);
        } else {
          let examMessage = '';
          switch (selectedExamType) {
            case 'jee-advanced':
              examMessage = ' No IITs or NITs found for your rank.';
              break;
            case 'ap-eapcet':
              examMessage = ' No Andhra Pradesh colleges found for your rank.';
              break;
            case 'ts-eamcet':
              examMessage = ' No Telangana colleges found for your rank.';
              break;
            default:
              examMessage = ' No colleges found for your rank.';
          }
          setError('No colleges found for your rank and exam type.' + examMessage + ' Try increasing your rank range.');
          toast.info('No colleges found for your rank and exam type.' + examMessage + ' Try increasing your rank range.');
        }
      } catch (error: any) {
        console.error('Error predicting colleges:', error);
        setError('Failed to predict colleges. Please try again later.');
        toast.error('Failed to predict colleges. Please try again later.');
        setPredictedColleges([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  // Auto-trigger prediction when all fields are set
  useEffect(() => {
    if (rank && category && examType) {
      setPredictedColleges([]); // Clear previous results
      predictColleges(rank, category, examType);
    } else {
      setPredictedColleges([]);
      setError(null);
    }
  }, [rank, category, examType, predictColleges]);

  const getCutoffForCategory = (college: College, selectedCategory: string) => {
    switch (selectedCategory) {
      case 'general': return college.cutoff_rank_general;
      case 'obc': return college.cutoff_rank_obc;
      case 'sc': return college.cutoff_rank_sc;
      case 'st': return college.cutoff_rank_st;
      case 'bc_a': return college.cutoff_rank_bc_a;
      case 'bc_b': return college.cutoff_rank_bc_b;
      case 'bc_c': return college.cutoff_rank_bc_c;
      case 'bc_d': return college.cutoff_rank_bc_d;
      case 'bc_e': return college.cutoff_rank_bc_e;
      default: return 0;
    }
  };

  const getExamTypeDescription = (examType: string) => {
    switch (examType) {
      case 'jee-advanced':
        return 'Showing only IITs and NITs';
      case 'ap-eapcet':
        return 'Showing only Andhra Pradesh colleges';
      case 'ts-eamcet':
        return 'Showing only Telangana colleges';
      case 'jee-main':
        return 'Showing all colleges in India';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 border-b-2 border-blue-100">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-blue-50"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">College Predictor</h1>
            <div className="w-9"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 pb-24">
        <Card className="p-6 mb-6 bg-white shadow-xl border-2 border-blue-200">
          <div className="flex items-center mb-4">
            <Target className="w-7 h-7 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Find Your Colleges</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="exam-type" className="text-base font-semibold text-gray-900">Exam Type</Label>
              <Select value={examType} onValueChange={setExamType} disabled={loading}>
                <SelectTrigger className="border-2 border-orange-200 focus:border-orange-400">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((exam) => (
                    <SelectItem key={exam.value} value={exam.value}>
                      {exam.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {examType && (
                <div className="text-sm text-gray-600 mt-1 bg-orange-50 p-2 rounded border-l-4 border-orange-300">
                  {getExamTypeDescription(examType)}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="rank" className="text-base font-semibold text-gray-900">Your Rank</Label>
              <Input
                id="rank"
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="Enter your rank"
                className="text-base border-2 border-blue-200 focus:border-blue-400"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-base font-semibold text-gray-900">Category</Label>
              <Select value={category} onValueChange={setCategory} disabled={loading}>
                <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400">
                  <SelectValue placeholder="Select your category" />
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

            {error && (
              <div className="text-red-600 text-sm font-medium">{error}</div>
            )}

            <Button 
              onClick={() => predictColleges(rank, category, examType)} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg font-semibold py-3 shadow-lg"
            >
              <Target className="w-5 h-5 mr-2" />
              {loading ? 'Predicting...' : 'Predict Colleges'}
            </Button>
          </div>
        </Card>

        {/* Results */}
        {predictedColleges.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Colleges You Can Get</h3>
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                {predictedColleges.length} colleges found
              </span>
            </div>

            {examType && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border-2 border-blue-200">
                <div className="text-sm font-medium text-blue-800">
                  📚 {getExamTypeDescription(examType)}
                </div>
              </div>
            )}

            {predictedColleges.map((college) => (
              <Card 
                key={college.id} 
                className="p-4 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 bg-white"
                onClick={() => navigate(`/college-details/${college.id}`)}
              >
                <div className="space-y-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{college.name}</h4>
                    <div className="flex items-center text-base text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1 text-red-500" />
                      {college.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-bold text-gray-900">{college.rating}/5.0</span>
                      </div>
                      <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L - ₹{college.total_fees_max ? (college.total_fees_max / 100000).toFixed(1) : '0'}L
                      </span>
                    </div>
                    <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full font-medium border border-blue-200">{college.type}</span>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">Cutoff Rank ({category.toUpperCase()}):</span>
                      <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {getCutoffForCategory(college, category)?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    <div className="text-xs text-green-700 mt-1 font-medium">
                      ✅ You can get admission (Your rank: {parseInt(rank).toLocaleString()})
                    </div>
                  </div>

                  <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-center">
                    {college.placement_percentage}% placement rate
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

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
                className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-green-600"
                onClick={() => navigate('/predictor')}
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
    </div>
  );
};

export default CollegePredictor;
