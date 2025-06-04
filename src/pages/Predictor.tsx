
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Target, Award, Home as HomeIcon, Users, BookOpen, Newspaper, User } from "lucide-react";
import { toast } from "sonner";

interface PredictionResult {
  exam: string;
  marks: number;
  predictedRank: string;
  eligibleColleges: College[];
}

interface College {
  id: number;
  name: string;
  location: string;
  cutoff_rank: number;
  course_name: string;
  branch: string;
}

const Predictor = () => {
  const [exam, setExam] = useState('');
  const [marks, setMarks] = useState('');
  const [category, setCategory] = useState('general');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const predictRank = (examType: string, marksObtained: number): string => {
    switch (examType) {
      case 'jee_main':
        if (marksObtained >= 286) return "1-100";
        if (marksObtained >= 250) return "100-500";
        if (marksObtained >= 200) return "500-1,500";
        if (marksObtained >= 160) return "1,500-5,000";
        if (marksObtained >= 140) return "5,000-10,000";
        if (marksObtained >= 120) return "10,000-20,000";
        if (marksObtained >= 100) return "20,000-35,000";
        if (marksObtained >= 80) return "35,000-60,000";
        if (marksObtained >= 60) return "60,000-100,000";
        if (marksObtained >= 40) return "100,000-150,000";
        return "150,000+";

      case 'jee_advanced':
        if (marksObtained >= 283) return "1-100";
        if (marksObtained >= 250) return "100-500";
        if (marksObtained >= 190) return "500-1,000";
        if (marksObtained >= 150) return "1,000-5,000";
        if (marksObtained >= 120) return "5,000-10,000";
        if (marksObtained >= 90) return "10,000-20,000";
        if (marksObtained >= 70) return "20,000-30,000";
        return "30,000+";

      case 'neet':
        if (marksObtained >= 700) return "1-100";
        if (marksObtained >= 650) return "100-1,000";
        if (marksObtained >= 600) return "1,000-5,000";
        if (marksObtained >= 550) return "5,000-15,000";
        if (marksObtained >= 500) return "15,000-40,000";
        if (marksObtained >= 450) return "40,000-75,000";
        if (marksObtained >= 400) return "75,000-120,000";
        if (marksObtained >= 350) return "120,000-200,000";
        return "200,000+";

      case 'eamcet':
        if (marksObtained >= 150) return "1-100";
        if (marksObtained >= 140) return "100-500";
        if (marksObtained >= 130) return "500-1,000";
        if (marksObtained >= 120) return "1,000-2,000";
        if (marksObtained >= 110) return "2,000-5,000";
        if (marksObtained >= 100) return "5,000-10,000";
        if (marksObtained >= 90) return "10,000-20,000";
        if (marksObtained >= 80) return "20,000-30,000";
        if (marksObtained >= 70) return "30,000-50,000";
        if (marksObtained >= 60) return "50,000-80,000";
        if (marksObtained >= 50) return "80,000-120,000";
        if (marksObtained >= 40) return "120,000-150,000+";
        return "150,000+";

      default:
        return "Unable to predict";
    }
  };

  const fetchEligibleColleges = async (examType: string, predictedRankRange: string): Promise<College[]> => {
    try {
      // Extract the upper bound of the rank range for comparison
      const rankNumber = extractRankNumber(predictedRankRange);
      
      const { data: courses, error } = await supabase
        .from('courses')
        .select(`
          id,
          course_name,
          branch,
          cutoff_rank_general,
          exam_accepted,
          colleges (
            id,
            name,
            location
          )
        `)
        .ilike('exam_accepted', `%${examType}%`)
        .gte('cutoff_rank_general', rankNumber)
        .order('cutoff_rank_general', { ascending: true })
        .limit(20);

      if (error) throw error;

      return courses?.map(course => ({
        id: course.colleges?.id || 0,
        name: course.colleges?.name || '',
        location: course.colleges?.location || '',
        cutoff_rank: course.cutoff_rank_general || 0,
        course_name: course.course_name,
        branch: course.branch
      })) || [];
    } catch (error) {
      console.error('Error fetching colleges:', error);
      return [];
    }
  };

  const extractRankNumber = (rankRange: string): number => {
    const match = rankRange.match(/(\d+)/);
    return match ? parseInt(match[1]) : 999999;
  };

  const handlePredict = async () => {
    if (!exam || !marks) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const marksNum = parseInt(marks);
      const predictedRank = predictRank(exam, marksNum);
      const eligibleColleges = await fetchEligibleColleges(exam, predictedRank);

      setPrediction({
        exam,
        marks: marksNum,
        predictedRank,
        eligibleColleges
      });
    } catch (error) {
      console.error('Error predicting rank:', error);
      toast.error('Failed to predict rank');
    } finally {
      setLoading(false);
    }
  };

  const getExamFullName = (examCode: string): string => {
    const examNames: { [key: string]: string } = {
      'jee_main': 'JEE Main',
      'jee_advanced': 'JEE Advanced',
      'neet': 'NEET',
      'eamcet': 'EAMCET'
    };
    return examNames[examCode] || examCode;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-lg font-semibold">Rank Predictor</h1>
          <p className="text-sm text-gray-600">Predict your rank and find eligible colleges</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 pb-20">
        {/* Input Form */}
        <Card className="p-4 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Enter Your Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="exam">Select Exam</Label>
              <Select value={exam} onValueChange={setExam}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jee_main">JEE Main</SelectItem>
                  <SelectItem value="jee_advanced">JEE Advanced</SelectItem>
                  <SelectItem value="neet">NEET</SelectItem>
                  <SelectItem value="eamcet">EAMCET</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="marks">Your Marks</Label>
              <Input
                id="marks"
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="Enter your marks"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
              onClick={handlePredict} 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Predicting...' : 'Predict Rank'}
            </Button>
          </div>
        </Card>

        {/* Prediction Results */}
        {prediction && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <Target className="w-8 h-8 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Rank Prediction</h3>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {prediction.predictedRank}
                </div>
                <div className="text-sm text-gray-600">
                  Based on {prediction.marks} marks in {getExamFullName(prediction.exam)}
                </div>
              </div>
            </Card>

            {/* Eligible Colleges */}
            <Card className="p-4">
              <div className="flex items-center mb-3">
                <Award className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-800">Eligible Colleges</h3>
              </div>
              
              {prediction.eligibleColleges.length > 0 ? (
                <div className="space-y-3">
                  {prediction.eligibleColleges.map((college, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-3 py-2">
                      <h4 className="font-medium text-gray-800">{college.name}</h4>
                      <p className="text-sm text-gray-600">{college.course_name} - {college.branch}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>{college.location}</span>
                        <span>Cutoff: {college.cutoff_rank}</span>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => navigate('/colleges')}
                  >
                    View All Colleges
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-2">No colleges found for this rank range</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/colleges')}
                  >
                    Browse All Colleges
                  </Button>
                </div>
              )}
            </Card>

            {/* Tips */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Tips for Better Prediction</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Predictions are based on previous year trends</li>
                <li>• Actual ranks may vary based on paper difficulty</li>
                <li>• Consider backup colleges with higher cutoffs</li>
                <li>• Check state quota and home state benefits</li>
              </ul>
            </Card>
          </div>
        )}

        {/* Exam Info Cards */}
        {!prediction && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Quick Exam Info</h3>
            <Card className="p-3">
              <h4 className="font-medium text-sm mb-1">JEE Main 2025</h4>
              <p className="text-xs text-gray-600">Total marks: 300 | 200+ for top NITs</p>
            </Card>
            <Card className="p-3">
              <h4 className="font-medium text-sm mb-1">NEET 2025</h4>
              <p className="text-xs text-gray-600">Total marks: 720 | 600+ for govt medical</p>
            </Card>
            <Card className="p-3">
              <h4 className="font-medium text-sm mb-1">EAMCET 2025</h4>
              <p className="text-xs text-gray-600">Total marks: 160 | 45 marks ≈ 150k+ rank</p>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around py-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/home')}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/colleges')}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">Colleges</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-green-600"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs">Predictor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/news')}
            >
              <Newspaper className="w-5 h-5" />
              <span className="text-xs">News</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/profile')}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictor;
