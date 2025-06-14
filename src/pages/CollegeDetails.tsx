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
  name: string;
  package: number;
  roles: string[];
  logo_url?: string;
}

interface Branch {
  name: string;
  seats: number;
  fees_per_year: number;
}

const CollegeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCollegeDetails();
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">College not found</h2>
          <Button onClick={() => navigate('/colleges')} className="bg-green-600 hover:bg-green-700">
            Browse Colleges
          </Button>
        </div>
      </div>
    );
  }

  // Parse JSON data safely with proper type assertions
  const branches: Branch[] = Array.isArray(college.branches_offered) 
    ? (college.branches_offered as unknown as Branch[])
    : [];
  const recruiters: Recruiter[] = Array.isArray(college.top_recruiters) 
    ? (college.top_recruiters as unknown as Recruiter[])
    : [];
  const branchRankings = (college.branch_wise_rankings && typeof college.branch_wise_rankings === 'object') 
    ? (college.branch_wise_rankings as Record<string, Record<string, number>>)
    : {};
  const examCutoffs = (college.exam_cutoffs && typeof college.exam_cutoffs === 'object') 
    ? (college.exam_cutoffs as Record<string, Record<string, number>>)
    : {};
  const eligibleExams = Array.isArray(college.eligible_exams) ? college.eligible_exams : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate('/colleges')} className="mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-gray-900">College Details</h1>
          </div>
          <Button onClick={handleSaveCollege} variant="outline" size="sm" className="border-green-500 text-green-600 hover:bg-green-50">
            <Heart className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* College Header */}
        <Card className="p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-6">
            {college.image_url && (
              <img 
                src={college.image_url} 
                alt={college.name}
                className="w-full lg:w-64 h-48 lg:h-64 object-cover rounded-lg"
                onError={(e) => {
                  console.error('Image failed to load:', college.image_url);
                  e.currentTarget.src = '/fallback-image.jpg';
                }}
                loading="lazy"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{college.name}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{college.location}</span>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {college.website_url && (
            <Button 
              variant="outline" 
              onClick={() => window.open(college.website_url!, '_blank')}
              className="flex items-center justify-center py-3 h-auto border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <Globe className="w-5 h-5 mr-2" />
              <div>
                <div className="font-semibold">Visit Website</div>
                <div className="text-sm opacity-75">Official site</div>
              </div>
            </Button>
          )}
          
          {college.apply_link && (
            <Button 
              onClick={() => window.open(college.apply_link!, '_blank')}
              className="flex items-center justify-center py-3 h-auto bg-green-600 hover:bg-green-700"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              <div>
                <div className="font-semibold">Apply Now</div>
                <div className="text-sm opacity-90">Start application</div>
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
          <Card className="p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed text-base">{college.description}</p>
          </Card>
        )}

        {/* Exam-wise Cutoff Ranks */}
        {eligibleExams.length > 0 && (
          <Card className="p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exam-wise Cutoff Ranks</h2>
            <div className="space-y-6">
              {eligibleExams.map((exam) => {
                const cutoffs = examCutoffs[exam];
                if (!cutoffs) return null;

                const examLabels: Record<string, string> = {
                  'jee-main': 'JEE Main',
                  'jee-advanced': 'JEE Advanced',
                  'neet': 'NEET',
                  'ap-eamcet': 'AP EAMCET (EAPCET)',
                  'ts-eamcet': 'TS EAMCET'
                };

                const categoryLabels: Record<string, string> = {
                  'general': 'General/OC',
                  'obc': 'OBC',
                  'sc': 'SC',
                  'st': 'ST',
                  'bc_a': 'BC-A',
                  'bc_b': 'BC-B',
                  'bc_c': 'BC-C',
                  'bc_d': 'BC-D',
                  'bc_e': 'BC-E'
                };

                return (
                  <div key={exam} className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h4 className="text-lg font-bold text-blue-700 mb-3 flex items-center">
                      <span className="bg-blue-100 px-3 py-1 rounded-full">
                        {examLabels[exam] || exam.toUpperCase()}
                      </span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {Object.entries(cutoffs).map(([category, rank]) => (
                        <div key={category} className="bg-white p-3 rounded-lg border border-blue-200">
                          <div className="text-xs text-gray-600 mb-1">
                            {categoryLabels[category] || category.toUpperCase()}
                          </div>
                          <div className="text-sm font-bold text-blue-600">
                            {rank.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800 font-medium">
                <strong>Note:</strong> These are previous year cutoff ranks and may vary this year based on various factors like exam difficulty, number of candidates, etc.
              </p>
            </div>
          </Card>
        )}

        {/* Available Branches */}
        {branches.length > 0 && (
          <Card className="p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Branches</h2>
            <div className="flex flex-col gap-6">
              {branches.map((branch, index) => (
                <div
                  key={index}
                  className="bg-[#FAFAFA] p-5 rounded-2xl border border-gray-200 shadow group hover:shadow-xl transition-all"
                >
                  <div className="flex flex-row flex-wrap items-center justify-between mb-2">
                    <h3 className="text-xl lg:text-2xl font-extrabold text-gray-900">
                      {branch.name}
                    </h3>
                    <div className="flex items-baseline gap-2 flex-wrap lg:flex-nowrap mt-2 lg:mt-0">
                      <span className="font-semibold text-lg text-green-700 mr-1">₹{(branch.fees_per_year/100000).toFixed(1)}L</span>
                      <span className="text-gray-500">Fees per year</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 mb-4 mt-1">
                    <span className="font-medium text-gray-600">Seats:</span>
                    <span className="font-bold text-lg text-gray-900">{branch.seats}</span>
                  </div>
                  
                  {branchRankings[branch.name] && (
                    <div className="mt-3">
                      <span className="block text-blue-700 text-base font-semibold mb-2 underline">Cutoff Ranks:</span>
                      {/* Arrange as two-column cutoff table for better readability */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-2 text-sm">
                        {Object.entries(branchRankings[branch.name]).map(([category, rank]) => (
                          <div key={category} className="flex gap-1 items-center">
                            <span className="min-w-[55px] text-gray-700 font-medium uppercase">{category}:</span>
                            <span className="text-gray-900 font-bold">{rank.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Key Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Key Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-gray-700 text-base">Fee Range</span>
                </div>
                <span className="font-bold text-sm">
                  ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L - ₹{college.total_fees_max ? (college.total_fees_max / 100000).toFixed(1) : '0'}L
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-gray-700 text-base">Placement Rate</span>
                </div>
                <span className="font-bold text-blue-600">{college.placement_percentage}%</span>
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
                  <span className="font-bold">{college.campus_area} acres</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              {college.contact_email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-blue-600 mr-3" />
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
                  <Phone className="w-4 h-4 text-green-600 mr-3" />
                  <div>
                    <span className="text-gray-600 block">Phone</span>
                    <a href={`tel:${college.contact_phone}`} className="text-green-600 hover:underline font-medium">{college.contact_phone}</a>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-red-600 mr-3 mt-1" />
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
          <Card className="p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Recruiters</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recruiters.map((recruiter, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center mb-3">
                    {recruiter.logo_url && (
                      <img 
                        src={recruiter.logo_url} 
                        alt={recruiter.name}
                        className="w-12 h-12 object-contain rounded mr-3"
                        onError={(e) => {
                          console.error('Recruiter image failed to load:', recruiter.logo_url);
                          e.currentTarget.src = '/fallback-logo.jpg';
                        }}
                        loading="lazy"
                      />
                    )}
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{recruiter.name}</h3>
                      <p className="text-xs text-green-600 font-semibold">
                        Package: ₹{(recruiter.package / 100000).toFixed(1)}L
                      </p>
                    </div>
                  </div>
                  {recruiter.roles && recruiter.roles.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Roles Offered:</p>
                      <div className="flex flex-wrap gap-1">
                        {recruiter.roles.map((role, roleIndex) => (
                          <span key={roleIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
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
  );
};

export default CollegeDetails;
