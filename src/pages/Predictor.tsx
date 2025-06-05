
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calculator, TrendingUp, BookOpen, Home as HomeIcon, Users, Newspaper, User } from "lucide-react";
import { toast } from "sonner";

const Predictor = () => {
  const [exam, setExam] = useState('');
  const [marks, setMarks] = useState('');
  const [ipeMarks, setIpeMarks] = useState('');
  const [category, setCategory] = useState('');
  const [result, setResult] = useState<{
    finalScore?: number;
    rank: string;
    colleges: string[];
  } | null>(null);
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
    // Convert IPE marks to group marks (out of 600)
    const ipeGroupMarks = (ipeMarks / 1000) * 600;
    
    // Calculate final weighted score using the formula
    const finalScore = (eamcetMarks / 160) * 75 + (ipeGroupMarks / 600) * 25;
    
    // Determine rank based on final score and category
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

  const predictRank = () => {
    if (!exam || !marks || !category) {
      toast.error('Please fill all required fields');
      return;
    }

    const marksNum = parseInt(marks);
    const ipeMarksNum = ipeMarks ? parseInt(ipeMarks) : 0;

    let prediction: { finalScore?: number; rank: string; colleges: string[] };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Rank Predictor</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 pb-20">
        <Card className="p-6 mb-6">
          <div className="flex items-center mb-4">
            <Calculator className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Predict Your Rank</h2>
          </div>
          
          <div className="space-y-4">
            {/* Exam Selection */}
            <div>
              <Label htmlFor="exam">Select Exam</Label>
              <Select value={exam} onValueChange={setExam}>
                <SelectTrigger>
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
              <Label htmlFor="marks">
                {isEAMCET ? 'EAMCET Marks (out of 160)' : `${exam.toUpperCase()} Marks`}
              </Label>
              <Input
                id="marks"
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder={isEAMCET ? "Enter marks out of 160" : "Enter your marks"}
              />
            </div>

            {/* IPE Marks for EAMCET */}
            {isEAMCET && (
              <div>
                <Label htmlFor="ipe-marks">IPE Marks (out of 1000)</Label>
                <Input
                  id="ipe-marks"
                  type="number"
                  value={ipeMarks}
                  onChange={(e) => setIpeMarks(e.target.value)}
                  placeholder="Enter IPE marks out of 1000"
                />
                <div className="text-xs text-gray-500 mt-1">
                  IPE marks are required for accurate EAMCET rank prediction
                </div>
              </div>
            )}

            {/* Category Selection */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
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

            <Button onClick={predictRank} className="w-full bg-green-600 hover:bg-green-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Predict Rank
            </Button>
          </div>
        </Card>

        {/* EAMCET Formula Explanation */}
        {isEAMCET && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">EAMCET Scoring Formula</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>Final Score = (EAMCET/160 × 75) + (IPE/600 × 25)</strong></p>
              <p>• 75% weightage for EAMCET marks</p>
              <p>• 25% weightage for IPE Group marks (PCM out of 600)</p>
              <p>• IPE marks are converted from 1000 to 600 scale</p>
            </div>
          </Card>
        )}

        {/* Results */}
        {result && (
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">Prediction Results</h3>
            </div>
            
            <div className="space-y-4">
              {result.finalScore && (
                <div className="bg-green-50 p-4 rounded">
                  <div className="text-sm text-green-600 mb-1">Final Weighted Score</div>
                  <div className="text-2xl font-bold text-green-700">
                    {result.finalScore.toFixed(2)}/100
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded">
                <div className="text-sm text-blue-600 mb-1">Expected Rank Range</div>
                <div className="text-xl font-bold text-blue-700">{result.rank}</div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Possible Colleges:</h4>
                <div className="space-y-2">
                  {result.colleges.map((college, index) => (
                    <div key={index} className="bg-gray-100 p-3 rounded text-sm">
                      {college}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <strong>Disclaimer:</strong> This is an estimated prediction based on previous year data. 
                Actual ranks may vary based on exam difficulty, number of candidates, and other factors.
              </div>
            </div>
          </Card>
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
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/colleges')}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs">Colleges</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-green-600"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs">Predictor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/news')}
            >
              <Newspaper className="w-6 h-6" />
              <span className="text-xs">News</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/profile')}
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictor;
