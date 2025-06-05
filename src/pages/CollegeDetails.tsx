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
  const [showVideo, setShowVideo] = useState(false);

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
        .eq('id', parseInt(id!))
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
        .eq('college_id', parseInt(id!));

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
        .eq('college_id', parseInt(id!))
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

  const getVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : null;
  };

  const videoId = college?.campus_tour_video_url ? getVideoId(college.campus_tour_video_url) : null;
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : null;

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
                onError={(e) => {
                  console.error('Image failed to load:', college.image_url);
                  e.currentTarget.src = '/fallback-image.jpg';
                }}
                loading="lazy"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{college.name}</h1>
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
        <div className="grid grid-cols-2 gap-4">
          {college.website_url && (
            <Button 
              variant="outline" 
              onClick={() => window.open(college.website_url!, '_blank')}
              className="flex items-center justify-center py-2 h-auto"
            >
              <Globe className="w-4 h-4 mr-2" />
              <div>
                <div className="font-semibold text-sm">Visit Website</div>
                <div className="text-xs text-gray-600">Official site</div>
              </div>
            </Button>
          )}
          
          {college.apply_link && (
            <Button 
              onClick={() => window.open(college.apply_link!, '_blank')}
              className="flex items-center justify-center py-2 h-auto bg-green-600 hover:bg-green-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              <div>
                <div className="font-semibold text-sm">Apply Now</div>
                <div className="text-xs opacity-90">Start application</div>
              </div>
            </Button>
          )}
        </div>

        {/* Description */}
        {college.description && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-base text-gray-700 leading-relaxed">{college.description}</p>
          </Card>
        )}

        {/* Campus Tour */}
        {college.campus_tour_video_url && thumbnailUrl && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Campus Tour</h2>
            <div className="relative cursor-pointer" onClick={() => setShowVideo(true)}>
              <img 
                src={thumbnailUrl} 
                alt="Campus Tour" 
                className="w-full h-40 object-cover rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-2 rounded-full">
                  <Play className="w-6 h-6 text-black" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {showVideo && college.campus_tour_video_url && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => setShowVideo(false)}>
                  Close
                </Button>
              </div>
              <div className="relative pt-[56.25%]">
                <iframe
                  src={college.campus_tour_video_url}
                  className="absolute top-0 left-0 w-full h-full"
                  allowFullScreen
                  title="Campus Tour Video"
                />
              </div>
            </div>
          </div>
        )}

        {/* Available Courses */}
        {courseMappings.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Available Courses</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {courseMappings.map((mapping) => (
                <div key={mapping.id} className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {mapping.courses.course_name} - {mapping.courses.branch}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Duration:</span>
                      <span className="font-medium text-sm">{mapping.courses.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Fees per year:</span>
                      <span className="font-bold text-green-600 text-sm">
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
      </div>
    </div>
  );
};

export default CollegeDetails;
