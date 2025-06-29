import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, GraduationCap, Star, ExternalLink } from "lucide-react";
import SEO from "@/components/SEO";

const CollegeDatabase = () => {
  const navigate = useNavigate();

  const colleges = [
    {
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
      facilities: ["Library", "Hostels", "Sports Complex", "Research Labs", "Computer Centers"],
      website: "https://andhrauniversity.edu.in",
      fees: {
        "B.Tech": "₹45,000 - ₹85,000 per year",
        "B.Sc": "₹15,000 - ₹25,000 per year",
        "B.Com": "₹12,000 - ₹20,000 per year",
        "MBA": "₹60,000 - ₹1,20,000 per year"
      },
      cutoff: {
        "B.Tech": "AP EAMCET: 5000-15000 rank",
        "MBA": "AP ICET: 1000-5000 rank"
      }
    },
    {
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
      fees: {
        "B.Tech": "₹2,00,000 - ₹2,50,000 per year",
        "M.Tech": "₹1,50,000 - ₹2,00,000 per year",
        "MBA": "₹4,00,000 - ₹5,00,000 per year"
      },
      cutoff: {
        "B.Tech": "JEE Advanced: 100-1000 rank",
        "M.Tech": "GATE: 95+ percentile"
      }
    },
    {
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
      fees: {
        "B.Tech": "₹2,00,000 - ₹2,50,000 per year",
        "M.Tech": "₹1,50,000 - ₹2,00,000 per year",
        "MBA": "₹4,00,000 - ₹5,00,000 per year"
      },
      cutoff: {
        "B.Tech": "JEE Advanced: 50-500 rank",
        "M.Tech": "GATE: 98+ percentile"
      }
    },
    {
      id: "iit-madras",
      name: "Indian Institute of Technology Madras",
      location: "Chennai, Tamil Nadu",
      type: "IIT",
      category: "Engineering",
      rating: 4.7,
      students: "9,000+",
      established: 1959,
      description: "IIT Madras is renowned for its academic excellence and research contributions in engineering and technology.",
      admissionInfo: "Admissions through JEE Advanced for B.Tech programs",
      courses: ["B.Tech", "M.Tech", "M.Sc", "Ph.D", "MBA"],
      facilities: ["Central Library", "Hostels", "Sports Complex", "Research Labs", "Innovation Center"],
      website: "https://www.iitm.ac.in",
      fees: {
        "B.Tech": "₹2,00,000 - ₹2,50,000 per year",
        "M.Tech": "₹1,50,000 - ₹2,00,000 per year",
        "MBA": "₹4,00,000 - ₹5,00,000 per year"
      },
      cutoff: {
        "B.Tech": "JEE Advanced: 100-800 rank",
        "M.Tech": "GATE: 96+ percentile"
      }
    },
    {
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
      fees: {
        "B.Tech": "₹1,50,000 - ₹2,00,000 per year",
        "M.Tech": "₹1,00,000 - ₹1,50,000 per year",
        "MBA": "₹2,50,000 - ₹3,50,000 per year"
      },
      cutoff: {
        "B.Tech": "JEE Main: 5000-15000 rank",
        "M.Tech": "GATE: 85+ percentile"
      }
    },
    {
      id: "nit-warangal",
      name: "National Institute of Technology Warangal",
      location: "Warangal, Telangana",
      type: "NIT",
      category: "Engineering",
      rating: 4.3,
      students: "7,500+",
      established: 1959,
      description: "NIT Warangal is a premier engineering institution known for its quality education and research in technology.",
      admissionInfo: "Admissions through JEE Main for B.Tech programs",
      courses: ["B.Tech", "M.Tech", "M.Sc", "Ph.D", "MBA"],
      facilities: ["Central Library", "Hostels", "Sports Complex", "Research Labs", "Innovation Center"],
      website: "https://www.nitw.ac.in",
      fees: {
        "B.Tech": "₹1,50,000 - ₹2,00,000 per year",
        "M.Tech": "₹1,00,000 - ₹1,50,000 per year",
        "MBA": "₹2,50,000 - ₹3,50,000 per year"
      },
      cutoff: {
        "B.Tech": "JEE Main: 8000-20000 rank",
        "M.Tech": "GATE: 80+ percentile"
      }
    },
    {
      id: "osmania-university",
      name: "Osmania University",
      location: "Hyderabad, Telangana",
      type: "State University",
      category: "Engineering, Arts, Science, Commerce",
      rating: 4.1,
      students: "45,000+",
      established: 1918,
      description: "Osmania University is one of the oldest universities in India, offering diverse programs in engineering, arts, science, and commerce.",
      admissionInfo: "Admissions based on TS EAMCET, TS ICET, and other state-level entrance exams",
      courses: ["B.Tech", "B.Sc", "B.Com", "B.A", "M.Tech", "M.Sc", "MBA", "Ph.D"],
      facilities: ["Library", "Hostels", "Sports Complex", "Research Labs", "Computer Centers"],
      website: "https://www.osmania.ac.in",
      fees: {
        "B.Tech": "₹40,000 - ₹80,000 per year",
        "B.Sc": "₹12,000 - ₹22,000 per year",
        "B.Com": "₹10,000 - ₹18,000 per year",
        "MBA": "₹50,000 - ₹1,00,000 per year"
      },
      cutoff: {
        "B.Tech": "TS EAMCET: 8000-20000 rank",
        "MBA": "TS ICET: 2000-8000 rank"
      }
    },
    {
      id: "anna-university",
      name: "Anna University",
      location: "Chennai, Tamil Nadu",
      type: "State University",
      category: "Engineering",
      rating: 4.4,
      students: "35,000+",
      established: 1978,
      description: "Anna University is a premier technical university in Tamil Nadu, known for its excellence in engineering education.",
      admissionInfo: "Admissions through TNEA for B.Tech programs",
      courses: ["B.Tech", "M.Tech", "M.Sc", "Ph.D", "MBA"],
      facilities: ["Central Library", "Hostels", "Sports Complex", "Research Labs", "Innovation Center"],
      website: "https://www.annauniv.edu",
      fees: {
        "B.Tech": "₹50,000 - ₹1,00,000 per year",
        "M.Tech": "₹80,000 - ₹1,20,000 per year",
        "MBA": "₹60,000 - ₹1,50,000 per year"
      },
      cutoff: {
        "B.Tech": "TNEA: 1000-10000 rank",
        "M.Tech": "GATE: 75+ percentile"
      }
    }
  ];

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('all');

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         college.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || college.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const handleViewDetails = (collegeId: string) => {
    navigate(`/college-details/${collegeId}`);
  };

  const handleCompare = (collegeId: string) => {
    // Store the college in localStorage for comparison
    const compareList = JSON.parse(localStorage.getItem('compareColleges') || '[]');
    if (!compareList.includes(collegeId)) {
      compareList.push(collegeId);
      localStorage.setItem('compareColleges', JSON.stringify(compareList));
    }
    navigate('/compare');
  };

  const handleVisitWebsite = (website: string) => {
    window.open(website, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title="College Database - NXTGEN | Complete Directory of Indian Universities"
        description="Comprehensive database of Indian colleges and universities including Andhra University, IITs, NITs, and other premier institutions. Find detailed information about admission requirements, courses, and facilities."
        keywords="college database, Indian universities, Andhra University, IIT colleges, NIT colleges, university directory, college information, admission details, Indian colleges list"
      />
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          College Database
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-8">
          Comprehensive directory of Indian colleges and universities
        </p>
        
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search colleges, universities, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">All Types</option>
            <option value="iit">IIT</option>
            <option value="nit">NIT</option>
            <option value="state university">State University</option>
            <option value="central university">Central University</option>
            <option value="private university">Private University</option>
          </select>
        </div>
      </div>

      {/* Colleges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.map((college) => (
          <Card key={college.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{college.name}</CardTitle>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {college.location}
                  </div>
                </div>
                <Badge variant={college.type === 'IIT' ? 'default' : 'secondary'}>
                  {college.type}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {college.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Rating */}
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{college.rating}/5</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({college.students} students)
                  </span>
                </div>

                {/* Category */}
                <div className="flex items-center">
                  <GraduationCap className="w-4 h-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{college.category}</span>
                </div>

                {/* Established */}
                <div className="text-sm text-muted-foreground">
                  Established: {college.established}
                </div>

                {/* Admission Info */}
                <div className="text-sm">
                  <strong>Admission:</strong> {college.admissionInfo}
                </div>

                {/* Popular Courses */}
                <div>
                  <strong className="text-sm">Popular Courses:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {college.courses.slice(0, 4).map((course, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                    {college.courses.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{college.courses.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewDetails(college.id)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCompare(college.id)}
                  >
                    Compare
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleVisitWebsite(college.website)}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredColleges.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No colleges found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-blue-600">{colleges.length}+</div>
            <div className="text-sm text-muted-foreground">Colleges Listed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600">23</div>
            <div className="text-sm text-muted-foreground">IITs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-purple-600">31</div>
            <div className="text-sm text-muted-foreground">NITs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-orange-600">500+</div>
            <div className="text-sm text-muted-foreground">Universities</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CollegeDatabase; 
