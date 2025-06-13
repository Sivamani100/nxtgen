
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calculator, TrendingUp, BookOpen, Home as HomeIcon, Users, Newspaper, User, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface PredictionResult {
  finalScore?: number;
  rank: string;
  colleges: string[];
}

const Predictor = () => {
  const [exam, setExam] = useState('');
  const [marks, setMarks] = useState('');
  const [ipeMarks, setIpeMarks] = useState('');
  const [category, setCategory] = useState('');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const navigate = useNavigate();

  const exams = [
    { value: 'jee-main', label: 'JEE Main' },
    { value: 'jee-advanced', label: 'JEE Advanced' },
    { value: 'neet', label: 'NEET' },
    { value: 'ap-eamcet', label: 'AP EAMCET (EAPCET)' },
    { value: 'ts-eamcet', label: 'TS EAMCET' }
  ];

  const categories = [
    { value: 'OC', label: 'OC (Open Category)' },
    { value: 'BC-A', label: 'BC-A' },
    { value: 'BC-B', label: 'BC-B' },
    { value: 'BC-C', label: 'BC-C' },
    { value: 'BC-D', label: 'BC-D' },
    { value: 'BC-E', label: 'BC-E' },
    { value: 'SC', label: 'SC' },
    { value: 'ST', label: 'ST' }
  ];

  const calculateAPEAMCETRank = (eamcetMarks: number, ipeMarks: number, category: string) => {
    const ipeGroupMarks = (ipeMarks / 1000) * 600;
    const finalScore = (eamcetMarks / 160) * 75 + (ipeGroupMarks / 600) * 25;
    
    let rankRange = '';
    
    if (finalScore >= 85) {
      rankRange = category === 'OC' ? '500 – 1,000' : '500 – 2,000';
    } else if (finalScore >= 80) {
      rankRange = category === 'OC' ? '1,000 – 2,000' : '1,000 – 3,000';
    } else if (finalScore >= 75) {
      rankRange = category === 'OC' ? '2,000 – 4,000' : '2,000 – 5,000';
    } else if (finalScore >= 70) {
      rankRange = category === 'OC' ? '4,000 – 6,000' : '3,000 – 6,000';
    } else if (finalScore >= 65) {
      rankRange = category === 'OC' ? '6,000 – 9,000' : '5,000 – 10,000';
    } else if (finalScore >= 60) {
      rankRange = category === 'OC' ? '9,000 – 13,000' : '8,000 – 15,000';
    } else if (finalScore >= 55) {
      rankRange = category === 'OC' ? '13,000 – 18,000' : '10,000 – 20,000';
    } else if (finalScore >= 50) {
      rankRange = category === 'OC' ? '18,000 – 25,000' : '15,000 – 30,000';
    } else if (finalScore >= 45) {
      rankRange = category === 'OC' ? '25,000 – 35,000' : '20,000 – 40,000';
    } else if (finalScore >= 40) {
      rankRange = category === 'OC' ? '35,000 – 45,000' : '30,000 – 50,000';
    } else if (finalScore >= 35) {
      rankRange = category === 'OC' ? '45,000 – 60,000' : '40,000 – 70,000';
    } else {
      rankRange = category === 'OC' ? '> 60,000' : '> 70,000';
    }
    
    return { finalScore, rankRange };
  };

  const predictRank = async () => {
    if (!exam || !marks || !category) {
      toast.error('Please fill all required fields');
      return;
    }

    const marksNum = parseInt(marks);
    const ipeMarksNum = ipeMarks ? parseInt(ipeMarks) : 0;

    let prediction: PredictionResult;

    switch (exam) {
      case 'jee-main':
        if (marksNum >= 250) {
          prediction = {
            rank: '1 - 10,000',
            colleges: ['IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Kanpur']
          };
        } else if (marksNum >= 200) {
          prediction = {
            rank: '10,000 - 50,000',
            colleges: ['NIT Trichy', 'NIT Warangal', 'IIIT Hyderabad', 'DTU']
          };
        } else if (marksNum >= 150) {
          prediction = {
            rank: '50,000 - 150,000',
            colleges: ['State Engineering Colleges', 'Private Universities']
          };
        } else {
          prediction = {
            rank: '> 150,000',
            colleges: ['Private Engineering Colleges', 'Regional Colleges']
          };
        }
        break;

      case 'neet':
        if (marksNum >= 600) {
          prediction = {
            rank: '1 - 5,000',
            colleges: ['AIIMS Delhi', 'JIPMER', 'Government Medical Colleges']
          };
        } else if (marksNum >= 550) {
          prediction = {
            rank: '5,000 - 25,000',
            colleges: ['State Medical Colleges', 'Central Universities']
          };
        } else if (marksNum >= 500) {
          prediction = {
            rank: '25,000 - 100,000',
            colleges: ['Private Medical Colleges', 'Deemed Universities']
          };
        } else {
          prediction = {
            rank: '> 100,000',
            colleges: ['Management Quota', 'Allied Health Sciences']
          };
        }
        break;

      case 'ap-eamcet':
      case 'ts-eamcet':
        if (!ipeMarks) {
          toast.error('IPE marks are required for EAMCET prediction');
          return;
        }
        const eamcetResult = calculateAPEAMCETRank(marksNum, ipeMarksNum, category);
        prediction = {
          finalScore: eamcetResult.finalScore,
          rank: eamcetResult.rankRange,
          colleges: eamcetResult.finalScore >= 70 
            ? ['Andhra University', 'JNTU Hyderabad', 'OU Engineering']
            : eamcetResult.finalScore >= 50
            ? ['SVCE', 'VNRVJIET', 'CBIT']
            : ['Private Engineering Colleges', 'Self-financed Colleges']
        };
        break;

      default:
        prediction = {
          rank: 'Prediction not available',
          colleges: ['Contact counselor for guidance']
        };
    }

    setResult(prediction);
    toast.success('Rank predicted successfully!');
  };

  const isEAMCET = exam === 'ap-eamcet' || exam === 'ts-eamcet';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 border-b-2 border-green-100">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Rank & College Predictor</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Navigation Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-green-200 hover:border-green-400 bg-white">
            <div className="text-center space-y-2">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto" />
              <h3 className="text-base font-bold text-green-700">Rank Predictor</h3>
              <p className="text-xs text-gray-600">Predict your rank based on marks</p>
            </div>
          </Card>
          <Card 
            className="p-4 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 bg-white"
            onClick={() => navigate('/college-predictor')}
          >
            <div className="text-center space-y-2">
              <GraduationCap className="w-8 h-8 text-blue-600 mx-auto" />
              <h3 className="text-base font-bold text-blue-700">College Predictor</h3>
              <p className="text-xs text-gray-600">Find colleges based on your rank</p>
            </div>
          </Card>
        </div>

        {/* Rank Predictor Section */}
        <Card className="p-6 mb-6 bg-white shadow-xl border-2 border-green-200">
          <div className="flex items-center mb-4">
            <Calculator className="w-7 h-7 text-green-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Predict Your Rank</h2>
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

            {/* Marks Input */}
            <div>
              <Label htmlFor="marks" className="text-base font-semibold text-gray-900">
                {isEAMCET ? 'EAMCET Marks (out of 160)' : `${exam.toUpperCase()} Marks`}
              </Label>
              <Input
                id="marks"
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder={isEAMCET ? "Enter marks out of 160" : "Enter your marks"}
                className="text-base border-2 border-purple-200 focus:border-purple-400"
              />
            </div>

            {/* IPE Marks for EAMCET */}
            {isEAMCET && (
              <div>
                <Label htmlFor="ipe-marks" className="text-base font-semibold text-gray-900">IPE Marks (out of 1000)</Label>
                <Input
                  id="ipe-marks"
                  type="number"
                  value={ipeMarks}
                  onChange={(e) => setIpeMarks(e.target.value)}
                  placeholder="Enter IPE marks out of 1000"
                  className="text-base border-2 border-orange-200 focus:border-orange-400"
                />
                <div className="text-sm text-gray-600 mt-1 bg-orange-50 p-2 rounded border-l-4 border-orange-300">
                  IPE marks are required for accurate EAMCET rank prediction
                </div>
              </div>
            )}

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

            <Button onClick={predictRank} className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-lg font-semibold py-3 shadow-lg">
              <TrendingUp className="w-5 h-5 mr-2" />
              Predict Rank
            </Button>
          </div>
        </Card>

        {/* EAMCET Formula Explanation */}
        {isEAMCET && (
          <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-2">EAMCET Scoring Formula</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p className="font-semibold bg-white p-2 rounded">Final Score = (EAMCET/160 × 75) + (IPE/600 × 25)</p>
              <p>• 75% weightage for EAMCET marks</p>
              <p>• 25% weightage for IPE Group marks (PCM out of 600)</p>
              <p>• IPE marks are converted from 1000 to 600 scale</p>
            </div>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 shadow-xl">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-7 h-7 text-green-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-900">Prediction Results</h3>
              </div>
              
              <div className="space-y-4">
                {result.finalScore && (
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg border-2 border-green-300">
                    <div className="text-sm font-medium text-green-700 mb-1">Final Weighted Score</div>
                    <div className="text-3xl font-bold text-green-800">
                      {result.finalScore.toFixed(2)}/100
                    </div>
                  </div>
                )}
                
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg border-2 border-blue-300">
                  <div className="text-sm font-medium text-blue-700 mb-1">Expected Rank Range</div>
                  <div className="text-2xl font-bold text-blue-800">{result.rank}</div>
                </div>
                
                <div className="text-sm text-gray-600 bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg border-2 border-orange-200">
                  <strong className="text-orange-800">Disclaimer:</strong> This is an estimated prediction based on previous year data. 
                  Actual ranks may vary based on exam difficulty, number of candidates, and other factors.
                </div>
              </div>
            </Card>

            {/* General College Suggestions */}
            <Card className="p-6 bg-white shadow-xl border-2 border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-3">General College Categories:</h4>
              <div className="space-y-2">
                {result.colleges.map((college, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-100 to-blue-100 p-3 rounded-lg border border-gray-200">
                    <span className="text-base font-medium text-gray-800">{college}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-medium">💡 For detailed college predictions with branch-wise cutoffs, use our College Predictor above!</p>
              </div>
            </Card>
          </div>
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

export default Predictor;
