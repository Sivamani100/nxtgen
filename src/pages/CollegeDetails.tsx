
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star, MapPin, Phone, Mail, Globe, Heart, BookOpen, Users, DollarSign, Award, Building, ExternalLink, Play } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import VideoPlayer from "@/components/VideoPlayer";

type College = Database['public']['Tables']['colleges']['Row'];
type Course = Database['public']['Tables']['courses']['Row'];

const CollegeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState<College | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCollegeDetails();
      fetchCourses();
      checkIfSaved();
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

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('college_id', parseInt(id!))
        .order('course_name', { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const checkIfSaved = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_college_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('college_id', parseInt(id!))
        .single();

      if (data) {
        setIsSaved(true);
      }
    } catch (error) {
      // No error handling needed - just means college is not saved
    }
  };

  const handleSaveCollege = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to save colleges');
        return;
      }

      if (isSaved) {
        const { error } = await supabase
          .from('user_college_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('college_id', parseInt(id!));

        if (error) throw error;
        setIsSaved(false);
        toast.success('College removed from favorites');
      } else {
        const { error } = await supabase
          .from('user_college_favorites')
          .insert({
            user_id: user.id,
            college_id: parseInt(id!)
          });

        if (error) throw error;
        setIsSaved(true);
        toast.success('College saved to favorites');
      }
    } catch (error) {
      console.error('Error saving college:', error);
      toast.error('Failed to save college');
    }
  };

  const handleApplyNow = () => {
    if (college?.apply_link) {
      window.open(college.apply_link, '_blank', 'noopener,noreferrer');
    } else {
      toast.info('Apply link not available for this college');
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
          {college.image_url ? (
            <div className="h-32 bg-gray-200 rounded mb-3 overflow-hidden">
              <img 
                src={college.image_url} 
                alt={college.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex');
                }}
              />
              <div className="h-full bg-gradient-to-br from-blue-400 to-green-600 rounded flex items-center justify-center" style={{display: 'none'}}>
                <span className="text-white font-bold text-lg text-center px-4">{college.name.substring(0, 20)}</span>
              </div>
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-br from-blue-400 to-green-600 rounded mb-3 flex items-center justify-center">
              <span className="text-white font-bold text-lg text-center px-4">{college.name.substring(0, 20)}</span>
            </div>
          )}
          
          <h2 className="text-lg font-bold text-gray-800 mb-2">{college.name}</h2>
          
          <div className="space-y-1 mb-3">
            {college.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {college.city && college.state ? `${college.city}, ${college.state}` : college.location}
              </div>
            )}
            {college.established_year && (
              <div className="text-sm text-gray-600">
                <Building className="w-4 h-4 mr-1 inline" />
                Established: {college.established_year}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{college.rating || '0'}/5.0</span>
            </div>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">{college.type}</span>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              className={`flex-1 ${isSaved ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
              onClick={handleSaveCollege}
            >
              <Heart className={`w-4 h-4 mr-1 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleApplyNow}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Apply Now
            </Button>
          </div>
        </Card>

        {/* Campus Tour Video */}
        {college.campus_tour_video_url && (
          <Card className="p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Play className="w-4 h-4 mr-2" />
              Campus Tour
            </h3>
            <VideoPlayer 
              url={college.campus_tour_video_url}
              title={`${college.name} Campus Tour`}
              className="aspect-video"
            />
          </Card>
        )}

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
            {/* About College */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">About College</h3>
              {college.description ? (
                <p className="text-sm text-gray-600 mb-3">{college.description}</p>
              ) : (
                <p className="text-sm text-gray-500 mb-3">No description available</p>
              )}
              
              <div className="space-y-2">
                {college.established_year && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Established</span>
                    <span className="text-sm font-medium">{college.established_year}</span>
                  </div>
                )}
                {college.affiliation && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Affiliation</span>
                    <span className="text-sm font-medium">{college.affiliation}</span>
                  </div>
                )}
                {college.campus_area && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Campus Area</span>
                    <span className="text-sm font-medium">{college.campus_area}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Facilities */}
            {college.facilities && Array.isArray(college.facilities) && college.facilities.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Facilities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(college.facilities as string[]).map((facility, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded text-center text-xs">
                      {String(facility)}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Accreditation */}
            {college.accreditation && Array.isArray(college.accreditation) && college.accreditation.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Accreditation</h3>
                <div className="space-y-1">
                  {(college.accreditation as string[]).map((acc, index) => (
                    <div key={index} className="text-sm text-gray-600">• {String(acc)}</div>
                  ))}
                </div>
              </Card>
            )}

            {/* Rankings */}
            {college.ranking && typeof college.ranking === 'object' && Object.keys(college.ranking).length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Rankings</h3>
                <div className="space-y-2">
                  {Object.entries(college.ranking as Record<string, any>).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                      <span className="text-sm font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Contact Information */}
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
                    <a 
                      href={college.website_url.startsWith('http') ? college.website_url : `https://${college.website_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-green-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Fees Structure */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Fees Structure</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {college.total_fees_min && college.total_fees_max ? (
                    `₹${(college.total_fees_min / 100000).toFixed(1)}L - ₹${(college.total_fees_max / 100000).toFixed(1)}L`
                  ) : college.total_fees_min ? (
                    `₹${(college.total_fees_min / 100000).toFixed(1)}L+`
                  ) : (
                    'Fees not available'
                  )}
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
                    <span className="ml-1 font-medium">{course.seats_total || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fees/Year:</span>
                    <span className="ml-1 font-medium">
                      {course.fees_per_year ? `₹${(course.fees_per_year / 100000).toFixed(1)}L` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cutoff:</span>
                    <span className="ml-1 font-medium">{course.cutoff_rank_general || 'N/A'}</span>
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
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {college.placement_percentage || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Placement Rate</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600 mb-1">
                      {college.highest_package ? `₹${(college.highest_package / 100000).toFixed(1)}L` : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-600">Highest Package</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600 mb-1">
                      {college.average_package ? `₹${(college.average_package / 100000).toFixed(1)}L` : 'N/A'}
                    </div>
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
