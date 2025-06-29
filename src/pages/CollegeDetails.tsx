import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Clock,
  DollarSign,
  Target
} from "lucide-react";
import SEO from "@/components/SEO";

const CollegeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
      description: "Andhra University is one of the oldest and most prestigious universities in India, offering comprehensive education in engineering, arts, science, and commerce. The university has a rich history of academic excellence and research contributions.",
      admissionInfo: "Admissions based on AP EAMCET, AP ICET, and other state-level entrance exams",
      courses: ["B.Tech", "B.Sc", "B.Com", "B.A", "M.Tech", "M.Sc", "MBA", "Ph.D"],
      facilities: ["Central Library", "Hostels", "Sports Complex", "Research Labs", "Computer Centers", "Auditorium", "Cafeteria", "Medical Center"],
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
        "MBA": "₹60,000 - ₹1,20,000 per year",
        "M.Tech": "₹40,000 - ₹80,000 per year",
        "Ph.D": "₹25,000 - ₹35,000 per year"
      },
      cutoff: {
        "B.Tech": "AP EAMCET: 5000-15000 rank",
        "MBA": "AP ICET: 1000-5000 rank",
        "M.Tech": "GATE: 70+ percentile"
      },
      placements: {
        averagePackage: "₹4.5 LPA",
        highestPackage: "₹12 LPA",
        topRecruiters: ["TCS", "Infosys", "Wipro", "Tech Mahindra", "HCL", "Cognizant"]
      },
      departments: [
        "Computer Science Engineering",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Electronics & Communication",
        "Information Technology",
        "Chemical Engineering",
        "Biotechnology"
      ],
      achievements: [
        "NAAC A++ Accreditation",
        "UGC Recognition",
        "AICTE Approved Programs",
        "ISO 9001:2015 Certified",
        "Ranked among top 50 universities in India"
      ]
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
      description: "IIT Delhi is one of the premier engineering institutions in India, known for its excellence in technical education and research. The institute has consistently ranked among the top engineering colleges in India and Asia.",
      admissionInfo: "Admissions through JEE Advanced for B.Tech programs",
      courses: ["B.Tech", "M.Tech", "M.Sc", "Ph.D", "MBA"],
      facilities: ["Central Library", "Hostels", "Sports Complex", "Research Labs", "Innovation Center", "Auditorium", "Cafeteria", "Medical Center"],
      website: "https://home.iitd.ac.in",
      contact: {
        phone: "+91-11-26591735",
        email: "deanacad@admin.iitd.ac.in",
        address: "IIT Delhi, Hauz Khas, New Delhi, Delhi 110016"
      },
      fees: {
        "B.Tech": "₹2,00,000 - ₹2,50,000 per year",
        "M.Tech": "₹1,50,000 - ₹2,00,000 per year",
        "MBA": "₹4,00,000 - ₹5,00,000 per year",
        "M.Sc": "₹1,00,000 - ₹1,50,000 per year",
        "Ph.D": "₹50,000 - ₹1,00,000 per year"
      },
      cutoff: {
        "B.Tech": "JEE Advanced: 100-1000 rank",
        "M.Tech": "GATE: 95+ percentile",
        "MBA": "CAT: 95+ percentile"
      },
      placements: {
        averagePackage: "₹15 LPA",
        highestPackage: "₹45 LPA",
        topRecruiters: ["Google", "Microsoft", "Amazon", "Apple", "Goldman Sachs", "McKinsey"]
      },
      departments: [
        "Computer Science & Engineering",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Biotechnology",
        "Mathematics",
        "Physics",
        "Chemistry"
      ],
      achievements: [
        "Institutes of Eminence (IoE)",
        "NAAC A++ Accreditation",
        "QS World Rankings Top 200",
        "Times Higher Education Top 500",
        "NIRF Rank 2 in Engineering"
      ]
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
      description: "IIT Bombay is one of the most prestigious engineering institutions in India, offering world-class education and research opportunities. The institute is known for its strong industry connections and excellent placement records.",
      admissionInfo: "Admissions through JEE Advanced for B.Tech programs",
      courses: ["B.Tech", "M.Tech", "M.Sc", "Ph.D", "MBA"],
      facilities: ["Central Library", "Hostels", "Sports Complex", "Research Labs", "Innovation Center", "Auditorium", "Cafeteria", "Medical Center"],
      website: "https://www.iitb.ac.in",
      contact: {
        phone: "+91-22-25722545",
        email: "deanacad@iitb.ac.in",
        address: "IIT Bombay, Powai, Mumbai, Maharashtra 400076"
      },
      fees: {
        "B.Tech": "₹2,00,000 - ₹2,50,000 per year",
        "M.Tech": "₹1,50,000 - ₹2,00,000 per year",
        "MBA": "₹4,00,000 - ₹5,00,000 per year",
        "M.Sc": "₹1,00,000 - ₹1,50,000 per year",
        "Ph.D": "₹50,000 - ₹1,00,000 per year"
      },
      cutoff: {
        "B.Tech": "JEE Advanced: 50-500 rank",
        "M.Tech": "GATE: 98+ percentile",
        "MBA": "CAT: 98+ percentile"
      },
      placements: {
        averagePackage: "₹18 LPA",
        highestPackage: "₹50 LPA",
        topRecruiters: ["Google", "Microsoft", "Amazon", "Apple", "Goldman Sachs", "McKinsey", "Bain"]
      },
      departments: [
        "Computer Science & Engineering",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Aerospace Engineering",
        "Metallurgical Engineering",
        "Energy Science & Engineering"
      ],
      achievements: [
        "Institutes of Eminence (IoE)",
        "NAAC A++ Accreditation",
        "QS World Rankings Top 150",
        "Times Higher Education Top 400",
        "NIRF Rank 1 in Engineering"
      ]
    }
  };

  const college = collegesData[id as keyof typeof collegesData];

  if (!college) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">College Not Found</h1>
          <p className="text-muted-foreground mb-4">The college you're looking for doesn't exist in our database.</p>
          <Button onClick={() => navigate('/college-database')}>
            Back to College Database
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title={`${college.name} - NXTGEN | Complete College Information`}
        description={`Get complete information about ${college.name} including admission requirements, courses, fees, placements, and facilities. Find detailed college information for ${college.location}.`}
        keywords={`${college.name}, college information, admission details, ${college.location}, ${college.type}, college fees, placement information`}
      />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={() => navigate('/college-database')}>
            ← Back to Database
          </Button>
          <Badge variant={college.type === 'IIT' ? 'default' : 'secondary'}>
            {college.type}
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">{college.name}</h1>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          {college.location}
        </div>
        
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="font-medium">{college.rating}/5</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 text-muted-foreground mr-1" />
            <span>{college.students} students</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-muted-foreground mr-1" />
            <span>Est. {college.established}</span>
          </div>
        </div>

        <p className="text-lg text-muted-foreground mb-6">{college.description}</p>

        <div className="flex gap-4">
          <Button onClick={() => window.open(college.website, '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Website
          </Button>
          <Button variant="outline" onClick={() => {
            const compareList = JSON.parse(localStorage.getItem('compareColleges') || '[]');
            if (!compareList.includes(college.id)) {
              compareList.push(college.id);
              localStorage.setItem('compareColleges', JSON.stringify(compareList));
            }
            navigate('/compare');
          }}>
            Add to Compare
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="admissions">Admissions</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{college.contact.phone}</span>
                  </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{college.contact.email}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground mt-1" />
                  <span>{college.contact.address}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                  <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {college.website}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Achievements & Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {college.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm">{achievement}</span>
                  </div>
                  ))}
                </div>
              </CardContent>
            </Card>
              </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Departments & Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {college.departments.map((dept, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {dept}
                  </Badge>
                ))}
              </div>
            </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="admissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Admission Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Admission Process</h4>
                <p className="text-muted-foreground">{college.admissionInfo}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Cutoff Ranks</h4>
          <div className="space-y-2">
                  {Object.entries(college.cutoff).map(([course, cutoff]) => (
                    <div key={course} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">{course}</span>
                      <span className="text-sm text-muted-foreground">{cutoff}</span>
              </div>
                  ))}
                </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Available Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {college.courses.map((course, index) => (
                  <Badge key={index} variant="secondary" className="text-sm p-2">
                    {course}
                  </Badge>
                      ))}
                    </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Fee Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(college.fees).map(([course, fee]) => (
                  <div key={course} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">{course}</span>
                    <span className="text-sm font-semibold">{fee}</span>
                          </div>
                        ))}
                      </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="placements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users2 className="w-5 h-5 mr-2" />
                Placement Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-1">Average Package</h4>
                  <p className="text-2xl font-bold text-green-600">{college.placements.averagePackage}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-1">Highest Package</h4>
                  <p className="text-2xl font-bold text-blue-600">{college.placements.highestPackage}</p>
                </div>
              </div>
              
                  <div>
                <h4 className="font-semibold mb-3">Top Recruiters</h4>
                <div className="flex flex-wrap gap-2">
                  {college.placements.topRecruiters.map((recruiter, index) => (
                    <Badge key={index} variant="outline">
                      {recruiter}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Campus Facilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {college.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">{facility}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollegeDetails;
