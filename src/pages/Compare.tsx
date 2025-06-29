import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  MapPin, 
  Users, 
  GraduationCap, 
  Star, 
  Calendar, 
  ExternalLink, 
  Phone, 
  Mail, 
  Globe,
  Building,
  BookOpen,
  Award,
  Users2,
  DollarSign,
  Target,
  Trash2,
  Plus
} from "lucide-react";
import SEO from "@/components/SEO";

const Compare = () => {
  const navigate = useNavigate();
  const [selectedColleges, setSelectedColleges] = useState<any[]>([]);

  // Real college data
  const collegesData = {
    "andhra-university": {
      id: "andhra-university",
      name: "Andhra University",
      location: "Visakhapatnam, Andhra Pradesh",
      type: "State University",
      category: "Engineering, Arts, Science, Commerce",
      rating: 4.2,
      students: "50,000+",
      established: 1926,
      description: "Andhra University is one of the oldest and most prestigious universities in India, offering comprehensive education in engineering, arts, science, and commerce.",
      admissionInfo: "Admissions based on AP EAMCET, AP ICET, and other state-level entrance exams",
      courses: ["B.Tech", "B.Sc", "B.Com", "B.A", "M.Tech", "M.Sc", "MBA", "Ph.D"],
      facilities: ["Central Library", "Hostels", "Sports Complex", "Research Labs", "Computer Centers"],
      website: "https://andhrauniversity.edu.in",
      contact: {
        phone: "+91-891-2844000",
        email: "registrar@andhrauniversity.edu.in",
        address: "Andhra University, Visakhapatnam, Andhra Pradesh 530003"
      },
      fees: {
        "B.Tech": "₹45,000 - ₹85,000 per year",
        "B.Sc": "₹15,000 - ₹25,000 per year",
        "B.Com": "₹12,000 - ₹20,000 per year",
        "MBA": "₹60,000 - ₹1,20,000 per year"
      },
      cutoff: {
        "B.Tech": "AP EAMCET: 5000-15000 rank",
        "MBA": "AP ICET: 1000-5000 rank"
      },
      placements: {
        averagePackage: "₹4.5 LPA",
        highestPackage: "₹12 LPA",
        topRecruiters: ["TCS", "Infosys", "Wipro", "Tech Mahindra", "HCL", "Cognizant"]
      }
    },
    "iit-delhi": {
      id: "iit-delhi",
      name: "Indian Institute of Technology Delhi",
      location: "New Delhi, Delhi",
      type: "IIT",
      category: "Engineering",
      rating: 4.8,
      students: "8,000+",
      established: 1961,
      description: "IIT Delhi is one of the premier engineering institutions in India, known for its excellence in technical education and research.",
      admissionInfo: "Admissions through JEE Advanced for B.Tech programs",
      courses: ["B.Tech", "M.Tech", "M.Sc", "Ph.D", "MBA"],
      facilities: ["Central Library", "Hostels", "Sports Complex", "Research Labs", "Innovation Center"],
      website: "https://home.iitd.ac.in",
      contact: {
        phone: "+91-11-26591735",
        email: "deanacad@admin.iitd.ac.in",
        address: "IIT Delhi, Hauz Khas, New Delhi, Delhi 110016"
      },
      fees: {
        "B.Tech": "₹2,00,000 - ₹2,50,000 per year",
        "M.Tech": "₹1,50,000 - ₹2,00,000 per year",
        "MBA": "₹4,00,000 - ₹5,00,000 per year"
      },
      cutoff: {
        "B.Tech": "JEE Advanced: 100-1000 rank",
        "M.Tech": "GATE: 95+ percentile"
      },
      placements: {
        averagePackage: "₹15 LPA",
        highestPackage: "₹45 LPA",
        topRecruiters: ["Google", "Microsoft", "Amazon", "Apple", "Goldman Sachs", "McKinsey"]
      }
    },
    "iit-bombay": {
      id: "iit-bombay",
      name: "Indian Institute of Technology Bombay",
      location: "Mumbai, Maharashtra",
      type: "IIT",
      category: "Engineering",
      rating: 4.9,
      students: "10,000+",
      established: 1958,
      description: "IIT Bombay is one of the most prestigious engineering institutions in India, offering world-class education and research opportunities.",
      admissionInfo: "Admissions through JEE Advanced for B.Tech programs",
      courses: ["B.Tech", "M.Tech", "M.Sc", "Ph.D", "MBA"],
      facilities: ["Central Library", "Hostels", "Sports Complex", "Research Labs", "Innovation Center"],
      website: "https://www.iitb.ac.in",
      contact: {
        phone: "+91-22-25722545",
        email: "deanacad@iitb.ac.in",
        address: "IIT Bombay, Powai, Mumbai, Maharashtra 400076"
      },
      fees: {
        "B.Tech": "₹2,00,000 - ₹2,50,000 per year",
        "M.Tech": "₹1,50,000 - ₹2,00,000 per year",
        "MBA": "₹4,00,000 - ₹5,00,000 per year"
      },
      cutoff: {
        "B.Tech": "JEE Advanced: 50-500 rank",
        "M.Tech": "GATE: 98+ percentile"
      },
      placements: {
        averagePackage: "₹18 LPA",
        highestPackage: "₹50 LPA",
        topRecruiters: ["Google", "Microsoft", "Amazon", "Apple", "Goldman Sachs", "McKinsey", "Bain"]
      }
    },
    "nit-trichy": {
      id: "nit-trichy",
      name: "National Institute of Technology Tiruchirappalli",
      location: "Tiruchirappalli, Tamil Nadu",
      type: "NIT",
      category: "Engineering",
      rating: 4.5,
      students: "8,500+",
      established: 1964,
      description: "NIT Trichy is one of the top NITs in India, offering excellent engineering education and research opportunities.",
      admissionInfo: "Admissions through JEE Main for B.Tech programs",
      courses: ["B.Tech", "M.Tech", "M.Sc", "Ph.D", "MBA"],
      facilities: ["Central Library", "Hostels", "Sports Complex", "Research Labs", "Innovation Center"],
      website: "https://www.nitt.edu",
      contact: {
        phone: "+91-431-2503000",
        email: "director@nitt.edu",
        address: "NIT Trichy, Tanjore Main Road, Tiruchirappalli, Tamil Nadu 620015"
      },
      fees: {
        "B.Tech": "₹1,50,000 - ₹2,00,000 per year",
        "M.Tech": "₹1,00,000 - ₹1,50,000 per year",
        "MBA": "₹2,50,000 - ₹3,50,000 per year"
      },
      cutoff: {
        "B.Tech": "JEE Main: 5000-15000 rank",
        "M.Tech": "GATE: 85+ percentile"
      },
      placements: {
        averagePackage: "₹8 LPA",
        highestPackage: "₹25 LPA",
        topRecruiters: ["TCS", "Infosys", "Wipro", "Tech Mahindra", "HCL", "Cognizant", "Amazon"]
      }
    }
  };

  useEffect(() => {
    // Load selected colleges from localStorage
    const compareList = JSON.parse(localStorage.getItem('compareColleges') || '[]');
    const colleges = compareList.map((id: string) => collegesData[id as keyof typeof collegesData]).filter(Boolean);
    setSelectedColleges(colleges);
  }, []);

  const removeCollege = (collegeId: string) => {
    const updatedColleges = selectedColleges.filter(college => college.id !== collegeId);
    setSelectedColleges(updatedColleges);
    
    // Update localStorage
    const compareList = JSON.parse(localStorage.getItem('compareColleges') || '[]');
    const updatedList = compareList.filter((id: string) => id !== collegeId);
    localStorage.setItem('compareColleges', JSON.stringify(updatedList));
  };

  const clearAll = () => {
    setSelectedColleges([]);
    localStorage.removeItem('compareColleges');
  };

  if (selectedColleges.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SEO 
          title="Compare Colleges - NXTGEN | Side-by-Side College Comparison"
          description="Compare Indian colleges and universities side-by-side. Analyze fees, placements, courses, and admission requirements to make informed decisions."
          keywords="compare colleges, college comparison, university comparison, Indian colleges comparison, college fees comparison, placement comparison"
        />
        
        <div className="text-center py-12">
          <div className="mb-6">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Compare Colleges</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Select colleges from our database to compare them side-by-side
            </p>
          </div>
          
          <Button onClick={() => navigate('/college-database')} className="text-lg px-8 py-3">
            <Plus className="w-5 h-5 mr-2" />
            Browse College Database
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title="Compare Colleges - NXTGEN | Side-by-Side College Comparison"
        description="Compare Indian colleges and universities side-by-side. Analyze fees, placements, courses, and admission requirements to make informed decisions."
        keywords="compare colleges, college comparison, university comparison, Indian colleges comparison, college fees comparison, placement comparison"
      />

        {/* Header */}
        <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Compare Colleges</h1>
            <p className="text-lg text-muted-foreground">
              Side-by-side comparison of {selectedColleges.length} colleges
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/college-database')}>
              <Plus className="w-4 h-4 mr-2" />
              Add More
            </Button>
            <Button variant="outline" onClick={clearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* College Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {selectedColleges.map((college) => (
            <Card key={college.id} className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={() => removeCollege(college.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{college.name}</CardTitle>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="text-sm">{college.location}</span>
                    </div>
                  </div>
                  <Badge variant={college.type === 'IIT' ? 'default' : 'secondary'} className="text-xs">
                    {college.type}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                    <span>{college.rating}/5</span>
                    </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 text-muted-foreground mr-1" />
                    <span>{college.students}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/college-details/${college.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
              </div>
            </div>

      {/* Comparison Tables */}
      <div className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Criteria</TableHead>
                  {selectedColleges.map((college) => (
                    <TableHead key={college.id}>{college.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Location</TableCell>
                    {selectedColleges.map((college) => (
                    <TableCell key={college.id}>{college.location}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Type</TableCell>
                    {selectedColleges.map((college) => (
                    <TableCell key={college.id}>
                      <Badge variant={college.type === 'IIT' ? 'default' : 'secondary'}>
                          {college.type}
                      </Badge>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Established</TableCell>
                  {selectedColleges.map((college) => (
                    <TableCell key={college.id}>{college.established}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Rating</TableCell>
                    {selectedColleges.map((college) => (
                    <TableCell key={college.id}>
                      <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>{college.rating}/5</span>
                        </div>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Student Strength</TableCell>
                    {selectedColleges.map((college) => (
                    <TableCell key={college.id}>{college.students}</TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Fee Structure */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Structure (B.Tech)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>College</TableHead>
                  <TableHead>B.Tech Fees (per year)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {selectedColleges.map((college) => (
                  <TableRow key={college.id}>
                    <TableCell className="font-medium">{college.name}</TableCell>
                    <TableCell>{college.fees["B.Tech"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Placement Information */}
        <Card>
          <CardHeader>
            <CardTitle>Placement Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>College</TableHead>
                  <TableHead>Average Package</TableHead>
                  <TableHead>Highest Package</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {selectedColleges.map((college) => (
                  <TableRow key={college.id}>
                    <TableCell className="font-medium">{college.name}</TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {college.placements.averagePackage}
                    </TableCell>
                    <TableCell className="text-blue-600 font-semibold">
                      {college.placements.highestPackage}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Admission Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Admission Requirements (B.Tech)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>College</TableHead>
                  <TableHead>Entrance Exam</TableHead>
                  <TableHead>Cutoff Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {selectedColleges.map((college) => (
                  <TableRow key={college.id}>
                    <TableCell className="font-medium">{college.name}</TableCell>
                    <TableCell>
                      {college.cutoff["B.Tech"]?.includes("JEE Advanced") ? "JEE Advanced" :
                       college.cutoff["B.Tech"]?.includes("JEE Main") ? "JEE Main" :
                       college.cutoff["B.Tech"]?.includes("AP EAMCET") ? "AP EAMCET" :
                       college.cutoff["B.Tech"]?.includes("TS EAMCET") ? "TS EAMCET" :
                       "State Level"}
                    </TableCell>
                    <TableCell>{college.cutoff["B.Tech"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Recruiters */}
        <Card>
          <CardHeader>
            <CardTitle>Top Recruiters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {selectedColleges.map((college) => (
                <div key={college.id} className="space-y-2">
                  <h4 className="font-semibold text-sm">{college.name}</h4>
                  <div className="flex flex-wrap gap-1">
                    {college.placements.topRecruiters.slice(0, 6).map((recruiter, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {recruiter}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {selectedColleges.map((college) => (
                <div key={college.id} className="space-y-2">
                  <h4 className="font-semibold text-sm">{college.name}</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                      <span>{college.contact.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 mr-1 text-muted-foreground" />
                      <span className="truncate">{college.contact.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-3 h-3 mr-1 text-muted-foreground" />
                      <a 
                        href={college.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        Website
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default Compare;
