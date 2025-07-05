import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, FileText, ExternalLink } from 'lucide-react';

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
      <DialogContent className="max-w-md max-h-[90vh] rounded-lg bg-white mx-auto p-4">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-blue-900">
               Important Updates
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-blue-900"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-500 mr-2" />
              Resources
            </h3>
            <div className="space-y-3">
              {importantResources.map((resource, index) => (
                <Card key={index} className="p-3 bg-blue-100 shadow-sm rounded-lg border border-blue-300">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="text-xs text-blue-700 border-blue-300">
                        {resource.type}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-blue-900 text-sm">
                      {resource.title}
                    </h4>
                    <p className="text-xs text-blue-600">
                      {resource.description}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenLink(resource.link)}
                      className="w-full text-xs border-green-300 text-green-700 hover:bg-green-50"
                    >
                      {resource.type === 'PDF' ? (
                        <FileText className="w-3 h-3 mr-1 text-green-500" />
                      ) : (
                        <ExternalLink className="w-3 h-3 mr-1 text-green-500" />
                      )}
                      Open {resource.type}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={onClose}
              className="bg-blue-900 text-white text-sm py-2 px-4 rounded hover:bg-blue-800"
            >
              Continue to App
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-green-500 text-white text-sm py-2 px-4 rounded hover:bg-green-600 border-green-500"
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
