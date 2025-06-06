import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star, MapPin, Phone, Mail, Globe, Heart, ExternalLink, Play, Building, Users, DollarSign, Award, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { BottomNavigation } from "@/components/BottomNavigation";

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
  const [videoError, setVideoError] = useState<string | null>(null);

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

  const getEmbedUrl = (url: string): string => {
    try {
      const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&\n?]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;

      if (!videoId) {
        console.error('Invalid YouTube URL:', url);
        setVideoError('Invalid YouTube URL. Please provide a valid video link.');
        return '';
      }

      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    } catch (error) {
      console.error('Error processing YouTube URL:', error);
      setVideoError('Unable to load the video. Please try again later.');
      return '';
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">College not found</h2>
          <Button onClick={() => navigate('/colleges')} className="bg-green-600 hover:bg-green-700">
            Browse Colleges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => navigate('/colleges')} className="mr-3">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-bold text-gray-900">College Details</h1>
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
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-base">{college.location}</span>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-lg font-bold text-gray-900">{college.rating}</span>
                    </div>
                    <span className="text-xs text-gray-600">Rating</span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L
                    </div>
                    <span className="text-xs text-gray-600">Min Fees</span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{college.placement_percentage}%</div>
                    <span className="text-xs text-gray-600">Placement</span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      ₹{college.highest_package ? (college.highest_package / 100000).toFixed(1) : '0'}L
                    </div>
                    <span className="text-xs text-gray-600">Highest Package</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">{college.type}</span>
                  {college.affiliation && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">{college.affiliation}</span>
                  )}
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Est. {college.established_year}</span>
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

          {/* Campus Tour Video */}
          {college.campus_tour_video_url && (
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">Campus Tour</h2>
              <div 
                className="relative cursor-pointer rounded-lg overflow-hidden"
                onClick={() => setShowVideo(true)}
              >
                <img
                  src={college.image_url || '/fallback-image.jpg'}
                  alt="Campus Tour Thumbnail"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white bg-black bg-opacity-50 rounded-full p-3" />
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
                {videoError ? (
                  <div className="text-center text-red-600 p-4">
                    <p>{videoError}</p>
                    <p>Please check if the video is publicly accessible and embedding is allowed.</p>
                  </div>
                ) : (
                  <div className="relative pt-[56.25%]">
                    <iframe
                      src={getEmbedUrl(college.campus_tour_video_url)}
                      className="absolute top-0 left-0 w-full h-full"
                      allowFullScreen
                      title="Campus Tour Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      onError={(e) => {
                        console.error('Iframe error:', e);
                        setVideoError('Failed to load the video. The video might be restricted or unavailable.');
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {college.description && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed text-base">{college.description}</p>
            </Card>
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
                        <p className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700 text-base">Fee Range</span>
                  </div>
                  <span className="font-bold text-base">
                    ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L - ₹{college.total_fees_max ? (college.total_fees_max / 100000).toFixed(1) : '0'}L
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-gray-700 text-base">Placement Rate</span>
                  </div>
                  <span className="font-bold text-base text-blue-600">{college.placement_percentage}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-gray-700 text-base">Highest Package</span>
                  </div>
                  <span className="font-bold text-base text-purple-600">
                    ₹{college.highest_package ? (college.highest_package / 100000).toFixed(1) : '0'}L
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-orange-600 mr-2" />
                    <span className="text-gray-700 text-base">Average Package</span>
                  </div>
                  <span className="font-bold text-base text-orange-600">
                    ₹{college.average_package ? (college.average_package / 100000).toFixed(1) : '0'}L
                  </span>
                </div>
                
                {college.campus_area && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="text-gray-700 text-base">Campus Area</span>
                    </div>
                    <span className="font-bold text-base">{college.campus_area} acres</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                {college.contact_email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-blue-600 mr-3" />
                    <div>
                      <span className="text-gray-600 block text-base">Email</span>
                      <a href={`mailto:${college.contact_email}`} className="text-blue-600 hover:underline font-medium text-base">
                        {college.contact_email}
                      </a>
                    </div>
                  </div>
                )}
                
                {college.contact_phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-green-600 mr-3" />
                    <div>
                      <span className="text-gray-600 block text-base">Phone</span>
                      <a href={`tel:${college.contact_phone}`} className="text-green-600 hover:underline font-medium text-base ">{college.contact_phone}</a>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-red-600 mr-3 mt-1" />
                  <div>
                    <span className="text-gray-600 block text-base">Address</span>
                    <span className="font-medium text-base">{college.location}</span>
                    <br />
                    <span className="text-gray-600 text-base">{college.city}, {college.state}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Recruiters */}
          {recruiters.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Top Recruiters</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {recruiters.map((recruiter) => (
                  <div key={recruiter.id} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center mb-3">
                      {recruiter.logo_url && (
                        <img 
                          src={recruiter.logo_url} 
                          alt={recruiter.recruiter_name}
                          className="w-12 h-12 object-contain rounded mr-3"
                          onError={(e) => {
                            console.error('Recruiter image failed to load:', recruiter.logo_url);
                            e.currentTarget.src = '/fallback-logo.jpg';
                          }}
                          loading="lazy"
                        />
                      )}
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{recruiter.recruiter_name}</h3>
                        <p className="text-xs text-green-600 font-semibold">
                          Package: ₹{(recruiter.package_offered / 100000).toFixed(1)}L
                        </p>
                      </div>
                    </div>
                    {recruiter.roles_offered && recruiter.roles_offered.length > 0 && (
                      <div>
                        <p className="text_xs text-gray-600 mb-2">Roles Offered:</p>
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

          {/* Facilities, Accreditation, Rankings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Facilities */}
            {college.facilities && Array.isArray(college.facilities) && college.facilities.length > 0 && (
              <Card className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Facilities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(college.facilities as string[]).map((facility, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded text-center text-base font-medium">
                      {String(facility)}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Accreditation */}
            {college.accreditation && Array.isArray(college.accreditation) && college.accreditation.length > 0 && (
              <Card className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Accreditation</h3>
                <div className="space-y-1">
                  {(college.accreditation as string[]).map((acc, index) => (
                    <div key={index} className="text-gray-700 text-base font-medium">• {String(acc)}</div>
                  ))}
                </div>
              </Card>
            )}

            {/* Rankings */}
            {college.ranking && typeof college.ranking === 'object' && Object.keys(college.ranking).length > 0 && (
              <Card className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Rankings</h3>
                <div className="space-y-2">
                  {Object.entries(college.ranking as Record<string, any>).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-700 text-base capitalize">{key.replace('_', ' ')}</span>
                      <span className="text-base font-bold text-blue-600">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
};

export default CollegeDetails;
