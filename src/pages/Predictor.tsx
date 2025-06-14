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
      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Rank & College Predictor
          </h1>
          <p className="text-gray-600">Predict your rank and find suitable colleges based on your exam scores</p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-green-200 hover:border-green-400 bg-white hover:scale-105">
            <div className="text-center space-y-3">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto" />
              <h3 className="text-xl font-bold text-green-700">Rank Predictor</h3>
              <p className="text-gray-600">Predict your rank based on marks</p>
            </div>
          </Card>
          <Card 
            className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 bg-white hover:scale-105"
            onClick={() => navigate('/college-predictor')}
          >
            <div className="text-center space-y-3">
              <GraduationCap className="w-12 h-12 text-blue-600 mx-auto" />
              <h3 className="text-xl font-bold text-blue-700">College Predictor</h3>
              <p className="text-gray-600">Find colleges based on your rank</p>
            </div>
          </Card>
        </div>

        {/* Rank Predictor Section */}
        <Card className="p-6 mb-6 bg-white shadow-xl border-t-4 border-gradient-to-r from-green-400 to-blue-400">
          <div className="flex items-center mb-6">
            <Calculator className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Predict Your Rank</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exam Selection */}
            <div>
              <Label htmlFor="exam" className="text-base font-semibold text-gray-900 mb-2 block">Select Exam</Label>
              <Select value={exam} onValueChange={setExam}>
                <SelectTrigger className="h-12 border-2 border-green-200 focus:border-green-400">
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

            {/* Category Selection */}
            <div>
              <Label htmlFor="category" className="text-base font-semibold text-gray-900 mb-2 block">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 border-2 border-blue-200 focus:border-blue-400">
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

            {/* Marks Input */}
            <div>
              <Label htmlFor="marks" className="text-base font-semibold text-gray-900 mb-2 block">
                {isEAMCET ? 'EAMCET Marks (out of 160)' : `${exam.toUpperCase()} Marks`}
              </Label>
              <Input
                id="marks"
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder={isEAMCET ? "Enter marks out of 160" : "Enter your marks"}
                className="h-12 text-base border-2 border-purple-200 focus:border-purple-400"
              />
            </div>

            {/* IPE Marks for EAMCET */}
            {isEAMCET && (
              <div>
                <Label htmlFor="ipe-marks" className="text-base font-semibold text-gray-900 mb-2 block">IPE Marks (out of 1000)</Label>
                <Input
                  id="ipe-marks"
                  type="number"
                  value={ipeMarks}
                  onChange={(e) => setIpeMarks(e.target.value)}
                  placeholder="Enter IPE marks out of 1000"
                  className="h-12 text-base border-2 border-orange-200 focus:border-orange-400"
                />
              </div>
            )}
          </div>

          {/* IPE Info for EAMCET */}
          {isEAMCET && (
            <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-l-4 border-orange-400">
              <p className="text-orange-800 font-medium">💡 IPE marks are required for accurate EAMCET rank prediction</p>
            </div>
          )}

          <Button 
            onClick={predictRank} 
            className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-lg font-semibold py-4 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Predict Rank
          </Button>
        </Card>

        {/* EAMCET Formula Explanation */}
        {isEAMCET && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
            <h3 className="text-xl font-bold text-blue-900 mb-3">EAMCET Scoring Formula</h3>
            <div className="text-sm text-blue-800 space-y-3">
              <p className="font-semibold bg-white p-3 rounded-lg shadow">Final Score = (EAMCET/160 × 75) + (IPE/600 × 25)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <p className="bg-white p-2 rounded">• 75% weightage for EAMCET marks</p>
                <p className="bg-white p-2 rounded">• 25% weightage for IPE Group marks</p>
              </div>
              <p className="bg-white p-2 rounded">• IPE marks are converted from 1000 to 600 scale (PCM)</p>
            </div>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 shadow-xl">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Prediction Results</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.finalScore && (
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-lg border-2 border-green-300">
                    <div className="text-sm font-medium text-green-700 mb-2">Final Weighted Score</div>
                    <div className="text-4xl font-bold text-green-800">
                      {result.finalScore.toFixed(2)}/100
                    </div>
                  </div>
                )}
                
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-lg border-2 border-blue-300">
                  <div className="text-sm font-medium text-blue-700 mb-2">Expected Rank Range</div>
                  <div className="text-3xl font-bold text-blue-800">{result.rank}</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-2 border-orange-200">
                <p className="text-orange-800"><strong>Disclaimer:</strong> This is an estimated prediction based on previous year data. 
                Actual ranks may vary based on exam difficulty, number of candidates, and other factors.</p>
              </div>
            </Card>

            {/* General College Suggestions */}
            <Card className="p-6 bg-white shadow-xl border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">General College Categories:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.colleges.map((college, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-100 to-blue-100 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <span className="text-base font-medium text-gray-800">{college}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-medium">💡 For detailed college predictions with branch-wise cutoffs, use our College Predictor above!</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Predictor;
