
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star, MapPin, Phone, Mail, Globe, Heart, BookOpen, Users, DollarSign, Award, Building } from "lucide-react";
import { toast } from "sonner";

interface College {
  id: number;
  name: string;
  location: string;
  city: string;
  state: string;
  type: string;
  affiliation: string;
  established_year: number;
  rating: number;
  total_fees_min: number;
  total_fees_max: number;
  placement_percentage: number;
  highest_package: number;
  average_package: number;
  campus_area: string;
  website_url: string;
  contact_email: string;
  contact_phone: string;
  description: string;
  facilities: any[];
  accreditation: any[];
}

interface Course {
  id: number;
  course_name: string;
  branch: string;
  duration: string;
  seats_total: number;
  fees_per_year: number;
  cutoff_rank_general: number;
  exam_accepted: string;
}

const CollegeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState<College | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchCollegeDetails();
      fetchCourses();
    }
  }, [id]);

  const fetchCollegeDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCollege(data);
    } catch (error) {
      console.error('Error fetching college details:', error);
      toast.error('Failed to load college details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('college_id', id)
        .order('course_name', { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSaveCollege = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to save colleges');
        return;
      }

      const { error } = await supabase
        .from('user_college_favorites')
        .insert({
          user_id: user.id,
          college_id: parseInt(id!)
        });

      if (error) throw error;
      toast.success('College saved to favorites');
    } catch (error) {
      console.error('Error saving college:', error);
      toast.error('Failed to save college');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">College not found</h2>
          <Button onClick={() => navigate('/colleges')}>Go back to colleges</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/colleges')} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">College Details</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {/* College Header */}
        <Card className="p-4 mb-4">
          <div className="h-32 bg-gradient-to-br from-blue-400 to-green-600 rounded mb-3 flex items-center justify-center">
            <span className="text-white font-bold text-lg text-center px-4">{college.name.substring(0, 20)}</span>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">{college.name}</h2>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {college.location}
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{college.rating}/5.0</span>
            </div>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">{college.type}</span>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={handleSaveCollege}
            >
              <Heart className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
              Apply Now
            </Button>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-lg mb-4 p-1">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'courses' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </Button>
          <Button
            variant={activeTab === 'placements' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('placements')}
          >
            Placements
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">About College</h3>
              <p className="text-sm text-gray-600 mb-3">{college.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Established</span>
                  <span className="text-sm font-medium">{college.established_year}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Affiliation</span>
                  <span className="text-sm font-medium">{college.affiliation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Campus Area</span>
                  <span className="text-sm font-medium">{college.campus_area}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
              <div className="space-y-3">
                {college.contact_phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="text-sm">{college.contact_phone}</span>
                  </div>
                )}
                {college.contact_email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="text-sm">{college.contact_email}</span>
                  </div>
                )}
                {college.website_url && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-500 mr-3" />
                    <a href={college.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Fees Structure</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  ₹{(college.total_fees_min / 100000).toFixed(1)}L - ₹{(college.total_fees_max / 100000).toFixed(1)}L
                </div>
                <div className="text-sm text-gray-600">Total Course Fees</div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-3">
            {courses.map((course) => (
              <Card key={course.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{course.course_name}</h4>
                    <p className="text-sm text-gray-600">{course.branch}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{course.exam_accepted}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="ml-1 font-medium">{course.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Seats:</span>
                    <span className="ml-1 font-medium">{course.seats_total}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fees/Year:</span>
                    <span className="ml-1 font-medium">₹{(course.fees_per_year / 100000).toFixed(1)}L</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cutoff:</span>
                    <span className="ml-1 font-medium">{course.cutoff_rank_general}</span>
                  </div>
                </div>
              </Card>
            ))}
            {courses.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500">No course information available</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'placements' && (
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Placement Statistics</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{college.placement_percentage}%</div>
                  <div className="text-sm text-gray-600">Placement Rate</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600 mb-1">₹{(college.highest_package / 100000).toFixed(1)}L</div>
                    <div className="text-xs text-gray-600">Highest Package</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600 mb-1">₹{(college.average_package / 100000).toFixed(1)}L</div>
                    <div className="text-xs text-gray-600">Average Package</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Top Recruiters</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-100 p-2 rounded text-center text-xs">TCS</div>
                <div className="bg-gray-100 p-2 rounded text-center text-xs">Infosys</div>
                <div className="bg-gray-100 p-2 rounded text-center text-xs">Wipro</div>
                <div className="bg-gray-100 p-2 rounded text-center text-xs">Accenture</div>
                <div className="bg-gray-100 p-2 rounded text-center text-xs">Capgemini</div>
                <div className="bg-gray-100 p-2 rounded text-center text-xs">Amazon</div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeDetails;
