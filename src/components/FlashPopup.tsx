
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ExternalLink, FileText, Star, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type College = Database['public']['Tables']['colleges']['Row'];

interface FlashPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const FlashPopup = ({ isOpen, onClose }: FlashPopupProps) => {
  const [topColleges, setTopColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchTopColleges();
    }
  }, [isOpen]);

  const fetchTopColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .not('type', 'ilike', '%polytechnic%')
        .not('type', 'ilike', '%medical%')
        .order('rating', { ascending: false })
        .limit(3);

      if (error) throw error;
      setTopColleges(data || []);
    } catch (error) {
      console.error('Error fetching top colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLink = (url: string | null) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-green-600 flex items-center">
            <Star className="w-6 h-6 mr-2 text-yellow-500" />
            Welcome to NXTGEN College Finder!
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Discover Your Perfect College Match!
            </h3>
            <p className="text-gray-600">
              Find the best colleges tailored to your preferences and career goals.
            </p>
          </div>

          {/* Top Recommended Colleges */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Top Recommended Colleges
            </h4>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {topColleges.map((college) => (
                  <Card key={college.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h5 className="font-semibold text-gray-900 text-sm">{college.name}</h5>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            {college.type}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="w-3 h-3 mr-1 text-green-500" />
                          {college.location}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{college.rating || 'N/A'}</span>
                          </div>
                          <span className="text-sm font-medium text-green-600">
                            ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L/year
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        {college.website_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenLink(college.website_url)}
                            className="text-xs"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Website
                          </Button>
                        )}
                        {college.apply_link && (
                          <Button
                            size="sm"
                            onClick={() => handleOpenLink(college.apply_link)}
                            className="text-xs bg-green-600 hover:bg-green-700"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Apply
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Important Resources */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Important Resources
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card className="p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2">College Admission Guide</h5>
                <p className="text-sm text-gray-600 mb-3">
                  Complete guide for college admissions and entrance exams.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenLink('#')}
                  className="w-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Open PDF Guide
                </Button>
              </Card>

              <Card className="p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2">Scholarship Information</h5>
                <p className="text-sm text-gray-600 mb-3">
                  Find scholarships and financial aid opportunities.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenLink('/scholarships')}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Scholarships
                </Button>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button
              onClick={onClose}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Continue to App
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOpenLink('/colleges')}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Explore All Colleges
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlashPopup;
