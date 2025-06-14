
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface PredictionResult {
  finalScore?: number;
  rank: string;
  colleges: string[];
}

const Predictor = () => {
  const [activeTab, setActiveTab] = useState('college-predictor');
  const [exam, setExam] = useState('');
  const [marks, setMarks] = useState('');
  const [rank, setRank] = useState('');
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
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center p-4">
          <h1 className="text-xl font-bold text-gray-900">College & Rank Predictor</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            College & Rank Predictor
          </h1>
          <p className="text-base text-gray-600">Predict your rank and find suitable colleges based on your exam scores</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Tab Navigation */}
        <div className="mb-6 lg:mb-8">
          <div className="grid grid-cols-2 gap-3 lg:gap-6">
            <Card 
              className={`p-4 lg:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:scale-105 ${
                activeTab === 'college-predictor' 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-blue-200 hover:border-blue-400 bg-white'
              }`}
              onClick={() => setActiveTab('college-predictor')}
            >
              <div className="text-center space-y-2 lg:space-y-3">
                <GraduationCap className="w-8 h-8 lg:w-12 lg:h-12 text-blue-600 mx-auto" />
                <h3 className="text-sm lg:text-xl font-bold text-blue-700">College Predictor</h3>
                <p className="text-xs lg:text-sm text-gray-600">Find colleges based on your rank</p>
              </div>
            </Card>
            <Card 
              className={`p-4 lg:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:scale-105 ${
                activeTab === 'rank-predictor' 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-green-200 hover:border-green-400 bg-white'
              }`}
              onClick={() => setActiveTab('rank-predictor')}
            >
              <div className="text-center space-y-2 lg:space-y-3">
                <TrendingUp className="w-8 h-8 lg:w-12 lg:h-12 text-green-600 mx-auto" />
                <h3 className="text-sm lg:text-xl font-bold text-green-700">Rank Predictor</h3>
                <p className="text-xs lg:text-sm text-gray-600">Predict your rank based on marks</p>
              </div>
            </Card>
          </div>
        </div>

        {/* College Predictor */}
        {activeTab === 'college-predictor' && (
          <Card className="p-4 lg:p-6 mb-6 bg-white shadow-xl border-t-4 border-blue-400">
            <div className="flex items-center mb-4 lg:mb-6">
              <GraduationCap className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 mr-3" />
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Find Your Colleges</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <Label htmlFor="exam" className="text-sm lg:text-base font-semibold text-gray-900 mb-2 block">Select Exam</Label>
                <Select value={exam} onValueChange={setExam}>
                  <SelectTrigger className="h-10 lg:h-12 border-2 border-blue-200 focus:border-blue-400">
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

              <div>
                <Label htmlFor="rank" className="text-sm lg:text-base font-semibold text-gray-900 mb-2 block">Your Rank</Label>
                <Input
                  id="rank"
                  type="number"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="Enter your rank"
                  className="h-10 lg:h-12 text-sm lg:text-base border-2 border-green-200 focus:border-green-400"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-sm lg:text-base font-semibold text-gray-900 mb-2 block">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-10 lg:h-12 border-2 border-purple-200 focus:border-purple-400">
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
            </div>

            <Button 
              onClick={() => navigate('/college-predictor')}
              className="w-full mt-4 lg:mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm lg:text-lg font-semibold py-3 lg:py-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <GraduationCap className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Find Colleges
            </Button>
          </Card>
        )}

        {/* Rank Predictor */}
        {activeTab === 'rank-predictor' && (
          <>
            <Card className="p-4 lg:p-6 mb-6 bg-white shadow-xl border-t-4 border-green-400">
              <div className="flex items-center mb-4 lg:mb-6">
                <Calculator className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mr-3" />
                <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Predict Your Rank</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <Label htmlFor="exam" className="text-sm lg:text-base font-semibold text-gray-900 mb-2 block">Select Exam</Label>
                  <Select value={exam} onValueChange={setExam}>
                    <SelectTrigger className="h-10 lg:h-12 border-2 border-green-200 focus:border-green-400">
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

                <div>
                  <Label htmlFor="category" className="text-sm lg:text-base font-semibold text-gray-900 mb-2 block">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-10 lg:h-12 border-2 border-blue-200 focus:border-blue-400">
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

                <div>
                  <Label htmlFor="marks" className="text-sm lg:text-base font-semibold text-gray-900 mb-2 block">
                    {isEAMCET ? 'EAMCET Marks (out of 160)' : `${exam.toUpperCase()} Marks`}
                  </Label>
                  <Input
                    id="marks"
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    placeholder={isEAMCET ? "Enter marks out of 160" : "Enter your marks"}
                    className="h-10 lg:h-12 text-sm lg:text-base border-2 border-purple-200 focus:border-purple-400"
                  />
                </div>

                {isEAMCET && (
                  <div>
                    <Label htmlFor="ipe-marks" className="text-sm lg:text-base font-semibold text-gray-900 mb-2 block">IPE Marks (out of 1000)</Label>
                    <Input
                      id="ipe-marks"
                      type="number"
                      value={ipeMarks}
                      onChange={(e) => setIpeMarks(e.target.value)}
                      placeholder="Enter IPE marks out of 1000"
                      className="h-10 lg:h-12 text-sm lg:text-base border-2 border-orange-200 focus:border-orange-400"
                    />
                  </div>
                )}
              </div>

              {isEAMCET && (
                <div className="mt-4 p-3 lg:p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-l-4 border-orange-400">
                  <p className="text-orange-800 font-medium text-sm lg:text-base">💡 IPE marks are required for accurate EAMCET rank prediction</p>
                </div>
              )}

              <Button 
                onClick={predictRank} 
                className="w-full mt-4 lg:mt-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-sm lg:text-lg font-semibold py-3 lg:py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Predict Rank
              </Button>
            </Card>

            {/* EAMCET Formula Explanation */}
            {isEAMCET && (
              <Card className="p-4 lg:p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
                <h3 className="text-lg lg:text-xl font-bold text-blue-900 mb-3">EAMCET Scoring Formula</h3>
                <div className="text-xs lg:text-sm text-blue-800 space-y-3">
                  <p className="font-semibold bg-white p-2 lg:p-3 rounded-lg shadow">Final Score = (EAMCET/160 × 75) + (IPE/600 × 25)</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                    <p className="bg-white p-2 rounded">• 75% weightage for EAMCET marks</p>
                    <p className="bg-white p-2 rounded">• 25% weightage for IPE Group marks</p>
                  </div>
                  <p className="bg-white p-2 rounded">• IPE marks are converted from 1000 to 600 scale</p>
                </div>
              </Card>
            )}

            {/* Results */}
            {result && (
              <Card className="p-4 lg:p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 shadow-xl">
                <div className="flex items-center mb-4 lg:mb-6">
                  <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mr-3" />
                  <h3 className="text-lg lg:text-2xl font-bold text-gray-900">Prediction Results</h3>
                </div>
                
                <div className="space-y-4">
                  {result.finalScore && (
                    <div className="bg-white p-3 lg:p-4 rounded-lg shadow">
                      <p className="text-sm lg:text-base text-gray-600">Final Score</p>
                      <p className="text-xl lg:text-2xl font-bold text-blue-600">{result.finalScore.toFixed(2)}</p>
                    </div>
                  )}
                  
                  <div className="bg-white p-3 lg:p-4 rounded-lg shadow">
                    <p className="text-sm lg:text-base text-gray-600">Predicted Rank Range</p>
                    <p className="text-xl lg:text-2xl font-bold text-green-600">{result.rank}</p>
                  </div>
                  
                  <div className="bg-white p-3 lg:p-4 rounded-lg shadow">
                    <p className="text-sm lg:text-base text-gray-600 mb-2">Possible Colleges</p>
                    <div className="space-y-1">
                      {result.colleges.map((college, index) => (
                        <p key={index} className="text-sm lg:text-base text-gray-800">• {college}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Predictor;
