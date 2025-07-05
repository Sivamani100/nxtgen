
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ExternalLink, FileText, Star, MapPin } from 'lucide-react';

interface FlashPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const FlashPopup = ({ isOpen, onClose }: FlashPopupProps) => {
 
  const importantResources = [
    {
      title: "Engineering Admission Guide 2024",
      description: "Complete guide for engineering admissions",
      link: "https://example.com/admission-guide.pdf",
      type: "PDF"
    },
    {
      title: "Scholarship Opportunities",
      description: "Latest scholarship information for students",
      link: "https://example.com/scholarships",
      type: "Link"
    }
  ];

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              Welcome! Important Updates & Top Colleges
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Top Colleges Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Top Recommended Colleges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topColleges.map((college, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        {college.type}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{college.rating}</span>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {college.name}
                    </h4>
                    
                    <div className="flex items-center text-xs text-gray-600">
                      <MapPin className="w-3 h-3 mr-1 text-green-500" />
                      {college.location}
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => handleOpenLink(college.link)}
                      className="w-full text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit Website
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Important Resources Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 text-blue-500 mr-2" />
              Important Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {importantResources.map((resource, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900">
                      {resource.title}
                    </h4>
                    
                    <p className="text-sm text-gray-600">
                      {resource.description}
                    </p>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenLink(resource.link)}
                      className="w-full"
                    >
                      {resource.type === 'PDF' ? (
                        <FileText className="w-4 h-4 mr-2" />
                      ) : (
                        <ExternalLink className="w-4 h-4 mr-2" />
                      )}
                      Open {resource.type}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button onClick={onClose} className="flex-1">
              Continue to App
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlashPopup;
