
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface PredictionResult {
  finalScore?: number;
  rank: string;
  colleges: string[];
}

const Predictor = () => {
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
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Header */}
        

        {/* Tabs */}
        <Tabs defaultValue="college-predictor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="college-predictor" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              College Predictor
            </TabsTrigger>
            <TabsTrigger value="rank-predictor" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Rank Predictor
            </TabsTrigger>
          </TabsList>

          {/* College Predictor Tab */}
          <TabsContent value="college-predictor">
            <Card className="p-6 bg-white shadow-sm border">
              <div className="flex items-center mb-6">
                <GraduationCap className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 mr-3" />
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Find Your Colleges</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="exam" className="text-base font-medium text-gray-900 mb-2 block">Select Exam</Label>
                  <Select value={exam} onValueChange={setExam}>
                    <SelectTrigger className="h-12">
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
                  <Label htmlFor="rank" className="text-base font-medium text-gray-900 mb-2 block">Your Rank</Label>
                  <Input
                    id="rank"
                    type="number"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="Enter your rank"
                    className="h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-base font-medium text-gray-900 mb-2 block">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-12">
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
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Find Colleges
              </Button>
            </Card>
          </TabsContent>

          {/* Rank Predictor Tab */}
          <TabsContent value="rank-predictor">
            <Card className="p-6 mb-6 bg-white shadow-sm border">
              <div className="flex items-center mb-6">
                <Calculator className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mr-3" />
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Predict Your Rank</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="exam" className="text-base font-medium text-gray-900 mb-2 block">Select Exam</Label>
                  <Select value={exam} onValueChange={setExam}>
                    <SelectTrigger className="h-12">
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
                  <Label htmlFor="category" className="text-base font-medium text-gray-900 mb-2 block">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-12">
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
                  <Label htmlFor="marks" className="text-base font-medium text-gray-900 mb-2 block">
                    {isEAMCET ? 'EAMCET Marks (out of 160)' : `${exam.toUpperCase()} Marks`}
                  </Label>
                  <Input
                    id="marks"
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    placeholder={isEAMCET ? "Enter marks out of 160" : "Enter your marks"}
                    className="h-12"
                  />
                </div>

                {isEAMCET && (
                  <div>
                    <Label htmlFor="ipe-marks" className="text-base font-medium text-gray-900 mb-2 block">IPE Marks (out of 1000)</Label>
                    <Input
                      id="ipe-marks"
                      type="number"
                      value={ipeMarks}
                      onChange={(e) => setIpeMarks(e.target.value)}
                      placeholder="Enter IPE marks out of 1000"
                      className="h-12"
                    />
                  </div>
                )}
              </div>

              {isEAMCET && (
                <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-orange-800 font-medium">💡 IPE marks are required for accurate EAMCET rank prediction</p>
                </div>
              )}

              <Button 
                onClick={predictRank} 
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Predict Rank
              </Button>
            </Card>

            {/* EAMCET Formula Explanation */}
            {isEAMCET && (
              <Card className="p-6 mb-6 bg-blue-50 border border-blue-200">
                <h3 className="text-xl font-bold text-blue-900 mb-4">EAMCET Scoring Formula</h3>
                <div className="text-sm text-blue-800 space-y-3">
                  <p className="font-semibold bg-white p-3 rounded shadow">Final Score = (EAMCET/160 × 75) + (IPE/600 × 25)</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
                <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200">
                  <div className="flex items-center mb-6">
                    <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900">Prediction Results</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {result.finalScore && (
                      <div className="bg-white p-6 rounded-lg border border-green-300">
                        <div className="text-sm font-medium text-green-700 mb-2">Final Weighted Score</div>
                        <div className="text-3xl lg:text-4xl font-bold text-green-800">
                          {result.finalScore.toFixed(2)}/100
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-white p-6 rounded-lg border border-blue-300">
                      <div className="text-sm font-medium text-blue-700 mb-2">Expected Rank Range</div>
                      <div className="text-2xl lg:text-3xl font-bold text-blue-800">{result.rank}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-orange-800 text-sm"><strong>Disclaimer:</strong> This is an estimated prediction based on previous year data. 
                    Actual ranks may vary based on exam difficulty, number of candidates, and other factors.</p>
                  </div>
                </Card>

                <Card className="p-6 bg-white border">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">General College Categories:</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {result.colleges.map((college, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border hover:shadow-sm transition-shadow">
                        <span className="font-medium text-gray-800">{college}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium">💡 For detailed college predictions with branch-wise cutoffs, use our College Predictor above!</p>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Predictor;
