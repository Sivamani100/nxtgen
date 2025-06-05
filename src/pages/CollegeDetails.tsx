
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star, MapPin, Phone, Mail, Globe, Heart, ExternalLink, Play, Building, Users, DollarSign, Award, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type College = Database['public']['Tables']['colleges']['Row'];

interface Recruiter {
  id: number;
  recruiter_name: string;
  logo_url: string;
  package_offered: number;
  roles_offered: string[];
}

interface CourseMapping {
  id: number;
  course_id: number;
  is_available: boolean;
  additional_info: string;
  courses: {
    course_name: string;
    branch: string;
    duration: string;
    fees_per_year: number;
  };
}

const CollegeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState<College | null>(null);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [courseMappings, setCourseMappings] = useState<CourseMapping[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCollegeDetails();
      fetchRecruiters();
      fetchCourseMappings();
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

  const fetchRecruiters = async () => {
    try {
      const { data, error } = await supabase
        .from('college_recruiters')
        .select('*')
        .eq('college_id', id);

      if (error) throw error;
      setRecruiters(data || []);
    } catch (error) {
      console.error('Error fetching recruiters:', error);
    }
  };

  const fetchCourseMappings = async () => {
    try {
      const { data, error } = await supabase
        .from('college_course_mapping')
        .select(`
          *,
          courses(course_name, branch, duration, fees_per_year)
        `)
        .eq('college_id', id)
        .eq('is_available', true);

      if (error) throw error;
      setCourseMappings(data || []);
    } catch (error) {
      console.error('Error fetching course mappings:', error);
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

      if (error) {
        if (error.code === '23505') {
          toast.error('College already saved');
        } else {
          throw error;
        }
        return;
      }

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">College not found</h2>
          <Button onClick={() => navigate('/colleges')} className="bg-green-600 hover:bg-green-700">
            Browse Colleges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate('/colleges')} className="mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">College Details</h1>
          </div>
          <Button onClick={handleSaveCollege} variant="outline" size="sm">
            <Heart className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* College Header */}
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {college.image_url && (
              <img 
                src={college.image_url} 
                alt={college.name}
                className="w-full lg:w-48 h-48 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{college.name}</h1>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{college.location}</span>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    <span className="text-xl font-bold text-gray-900">{college.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">Rating</span>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L
                  </div>
                  <span className="text-sm text-gray-600">Min Fees</span>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{college.placement_percentage}%</div>
                  <span className="text-sm text-gray-600">Placement</span>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">
                    ₹{college.highest_package ? (college.highest_package / 100000).toFixed(1) : '0'}L
                  </div>
                  <span className="text-sm text-gray-600">Highest Package</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{college.type}</span>
                {college.affiliation && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">{college.affiliation}</span>
                )}
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">Est. {college.established_year}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {college.website_url && (
            <Button 
              variant="outline" 
              onClick={() => window.open(college.website_url!, '_blank')}
              className="flex items-center justify-center p-4 h-auto"
            >
              <Globe className="w-5 h-5 mr-2" />
              <div>
                <div className="font-semibold">Visit Website</div>
                <div className="text-sm text-gray-600">Official college website</div>
              </div>
            </Button>
          )}
          
          {college.apply_link && (
            <Button 
              onClick={() => window.open(college.apply_link!, '_blank')}
              className="flex items-center justify-center p-4 h-auto bg-green-600 hover:bg-green-700"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              <div>
                <div className="font-semibold">Apply Now</div>
                <div className="text-sm opacity-90">Start your application</div>
              </div>
            </Button>
          )}
          
          {college.campus_tour_video_url && (
            <Button 
              variant="outline"
              onClick={() => window.open(college.campus_tour_video_url!, '_blank')}
              className="flex items-center justify-center p-4 h-auto"
            >
              <Play className="w-5 h-5 mr-2" />
              <div>
                <div className="font-semibold">Campus Tour</div>
                <div className="text-sm text-gray-600">Virtual campus visit</div>
              </div>
            </Button>
          )}
        </div>

        {/* Description */}
        {college.description && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{college.description}</p>
          </Card>
        )}

        {/* Available Courses */}
        {courseMappings.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Courses</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {courseMappings.map((mapping) => (
                <div key={mapping.id} className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {mapping.courses.course_name} - {mapping.courses.branch}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{mapping.courses.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Fees per year:</span>
                      <span className="font-bold text-green-600">
                        ₹{(mapping.courses.fees_per_year / 100000).toFixed(1)}L
                      </span>
                    </div>
                    {mapping.additional_info && (
                      <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                        {mapping.additional_info}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Key Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-gray-700">Fee Range</span>
                </div>
                <span className="font-bold text-lg">
                  ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L - ₹{college.total_fees_max ? (college.total_fees_max / 100000).toFixed(1) : '0'}L
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-700">Placement Rate</span>
                </div>
                <span className="font-bold text-lg text-blue-600">{college.placement_percentage}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-gray-700">Highest Package</span>
                </div>
                <span className="font-bold text-lg text-purple-600">
                  ₹{college.highest_package ? (college.highest_package / 100000).toFixed(1) : '0'}L
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-gray-700">Average Package</span>
                </div>
                <span className="font-bold text-lg text-orange-600">
                  ₹{college.average_package ? (college.average_package / 100000).toFixed(1) : '0'}L
                </span>
              </div>
              
              {college.campus_area && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="text-gray-700">Campus Area</span>
                  </div>
                  <span className="font-bold text-lg">{college.campus_area} acres</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              {college.contact_email && (
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <span className="text-gray-600 block">Email</span>
                    <a href={`mailto:${college.contact_email}`} className="text-blue-600 hover:underline font-medium">
                      {college.contact_email}
                    </a>
                  </div>
                </div>
              )}
              
              {college.contact_phone && (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <span className="text-gray-600 block">Phone</span>
                    <a href={`tel:${college.contact_phone}`} className="text-green-600 hover:underline font-medium">
                      {college.contact_phone}
                    </a>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-red-600 mr-3 mt-1" />
                <div>
                  <span className="text-gray-600 block">Address</span>
                  <span className="font-medium">{college.location}</span>
                  <br />
                  <span className="text-gray-600">{college.city}, {college.state}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Recruiters */}
        {recruiters.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Recruiters</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recruiters.map((recruiter) => (
                <div key={recruiter.id} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center mb-3">
                    {recruiter.logo_url && (
                      <img 
                        src={recruiter.logo_url} 
                        alt={recruiter.recruiter_name}
                        className="w-12 h-12 object-contain rounded mr-3"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{recruiter.recruiter_name}</h3>
                      <p className="text-sm text-green-600 font-semibold">
                        Package: ₹{(recruiter.package_offered / 100000).toFixed(1)}L
                      </p>
                    </div>
                  </div>
                  {recruiter.roles_offered && recruiter.roles_offered.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Roles Offered:</p>
                      <div className="flex flex-wrap gap-1">
                        {recruiter.roles_offered.map((role, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Additional Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Facilities */}
          {college.facilities && Array.isArray(college.facilities) && college.facilities.length > 0 && (
            <Card className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Facilities</h3>
              <div className="grid grid-cols-2 gap-2">
                {(college.facilities as string[]).map((facility, index) => (
                  <div key={index} className="bg-gray-100 p-2 rounded text-center text-sm font-medium">
                    {String(facility)}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Accreditation */}
          {college.accreditation && Array.isArray(college.accreditation) && college.accreditation.length > 0 && (
            <Card className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Accreditation</h3>
              <div className="space-y-1">
                {(college.accreditation as string[]).map((acc, index) => (
                  <div key={index} className="text-sm text-gray-700 font-medium">• {String(acc)}</div>
                ))}
              </div>
            </Card>
          )}

          {/* Rankings */}
          {college.ranking && typeof college.ranking === 'object' && Object.keys(college.ranking).length > 0 && (
            <Card className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Rankings</h3>
              <div className="space-y-2">
                {Object.entries(college.ranking as Record<string, any>).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">{key.replace('_', ' ')}</span>
                    <span className="text-sm font-bold text-blue-600">{String(value)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;
